/* * */

import { useNotificationsContext } from '@/contexts/Notifications.context';
import { type DotPath, HttpException, type PathValue, setValueAtPath } from '@/core-replica';
import { type Account } from '@/schemas/account';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const LOCAL_STORAGE_KEYS = {
	device_id: 'device_id',
};

/* * */

interface AccountContextState {
	actions: {
		createAccount: () => Promise<void>
		update: (path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) => Promise<void>
	}
	data: {
		account: Account | undefined
		device_id: string | undefined
	}
	flags: {
		anonymous: boolean
		error: boolean
		init: boolean
		loading: boolean
	}
}

/* * */

const AccountContext = createContext<AccountContextState | undefined>(undefined);

export function useAccountContext() {
	const context = useContext(AccountContext);
	if (!context) {
		throw new Error('useAccountContext must be used within a AccountContextProvider');
	}
	return context;
}

/* * */

export const AccountContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const notificationsContext = useNotificationsContext();

	const [isInit, setIsInit] = useState<boolean>(false);
	const [deviceId, setDeviceId] = useState<string | undefined>();

	//
	// B. Fetch data

	const { data: accountData, error: accountError, isLoading: accountLoading, mutate: accountMutate } = useSWR<Account, HttpException>({ device_id: deviceId, url: `${getServiceUrl('accounts')}/accounts` }, swrFetcher, { refreshInterval: 10_000 });

	//
	// C. Handle actions

	const fetchNewAccount = async () => {
		// ...or else fetch a new one from the server
		const newAccount = await fetchData<{ device_id: string }>(`${getServiceUrl('accounts')}/accounts/new`);
		if (!newAccount.data?.device_id) return;
		await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.device_id, newAccount.data.device_id);
		setDeviceId(newAccount.data.device_id);
		setIsInit(true);
	};

	useEffect(() => {
		(async () => {
			// Skip if already initialized
			if (isInit) return;
			// Try to get Device ID from local storage
			const foundDeviceId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.device_id);
			// Set Device ID if found...
			if (foundDeviceId) setDeviceId(foundDeviceId);
			// Update state to initialized
			setIsInit(true);
		})();
	}, [isInit]);

	useEffect(() => {
		// Skip if no error
		if (!accountError) return;
		// Skip if error is 404 (Not Found)
		if (accountError.statusCode !== 404) return;
		// This means the Device ID is invalid, so we need to clear it
		AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.device_id);
		setDeviceId(undefined);
		setIsInit(false);
	}, [accountError]);

	async function updateAccountApi(updatedAccountData: Account): Promise<Account> {
		const response = await fetchData<Account>(
			`${getServiceUrl('accounts')}/accounts`,
			'PUT',
			updatedAccountData,
			{ 'Authorization': `Bearer ${deviceId}`, 'Content-Type': 'application/json' },
		);
		if (response.data) return response.data;
		else throw new Error(response.error || 'Failed to update account');
	};

	async function update(path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) {
		if (!accountData || !deviceId) return;
		// Update local copy of the data
		const updatedAccountData = setValueAtPath(Object.assign({}, accountData), path, value);
		// Update local SWR data immediately (optimistic update)
		accountMutate(updateAccountApi(updatedAccountData), { optimisticData: updatedAccountData, populateCache: true, revalidate: false });
	};

	const updateDeviceDetails = async () => {
		// Skip if no account data
		if (!accountData) return;
		// Get the current device
		const currentDevice = accountData.devices.find(d => d.device_id === deviceId);
		const currentDeviceIndex = accountData.devices.findIndex(d => d.device_id === deviceId);
		if (!currentDevice || currentDeviceIndex === -1) return;
		// Update device with latest information
		const updatedDevice = {
			...accountData.devices[currentDeviceIndex],
			app_version: Constants.expoConfig?.version || null,
			brand: Device.brand,
			name: Device.deviceName || null,
			push_token: notificationsContext.data.token || null,
		};
		// Update the account with the updated device info
		await update(`devices.${currentDeviceIndex}`, updatedDevice);
	};

	useEffect(() => {
		updateDeviceDetails();
		const interval = setInterval(updateDeviceDetails, 60_000); // Every minute
		return () => clearInterval(interval);
	}, [deviceId, notificationsContext.data.token]);

	const createAccount = async () => {
		if (!isInit || deviceId) return;
		await fetchNewAccount();
	};

	//
	// D. Context value

	const contextValue: AccountContextState = useMemo(() => ({
		actions: {
			createAccount,
			update,
		},
		data: {
			account: accountData,
			device_id: deviceId,
		},
		flags: {
			anonymous: isInit && !deviceId,
			error: !!accountError,
			init: isInit,
			loading: !isInit || accountLoading,
		},
	}), [
		accountData,
		accountError,
		accountLoading,
		deviceId,
		isInit,
	]);

	//
	// E. Render components

	return (
		<AccountContext.Provider value={contextValue}>
			{children}
		</AccountContext.Provider>
	);

	//
};
