/* * */

import { useNotificationsContext } from '@/contexts/Notifications.context';
import { Dates, type DotPath, HttpException, type PathValue, setValueAtPath } from '@/core-replica';
import { type Account } from '@/schemas/account';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';

/* * */

const LOCAL_STORAGE_KEYS = {
	device_id: 'device_id',
	legacy_token: 'token',
};

/* * */

interface AccountContextState {
	actions: {
		createAccount: () => Promise<void>
		deleteAccount: () => Promise<void>
		favoriteLineId: (operation: 'add' | 'remove' | 'toggle', lineId: string) => void
		favoriteStopId: (operation: 'add' | 'remove' | 'toggle', stopId: string) => void
		update: (path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) => void
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

	const accountRef = useRef<Account | undefined>(undefined);
	const [accountData, setAccountData] = useState<Account>();

	//
	// B. Fetch data

	const { data: fetchedAccountData, error: accountError, isLoading: accountLoading, mutate: accountMutate } = useSWR<Account, HttpException>({ device_id: deviceId, url: `${getServiceUrl('accounts')}/accounts` }, swrFetcher, { refreshInterval: 10_000 });

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no fetched data
		if (!fetchedAccountData) return;
		// Update refs and state
		accountRef.current = fetchedAccountData;
		setAccountData(fetchedAccountData);
	}, [fetchedAccountData]);

	useEffect(() => {
		(async () => {
			// Skip if already initialized
			if (isInit) return;
			// Try to get Device ID from local storage
			const foundDeviceId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.device_id);
			const foundLegacyToken = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.legacy_token);
			// Handle "reset" case when ID is invalid
			if (foundDeviceId && foundDeviceId === 'newDeviceId') {
				await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.device_id);
				setDeviceId(undefined);
				setIsInit(true);
				return;
			}
			// Handle "reset" case when ID is invalid
			if (foundLegacyToken && foundLegacyToken === 'newDeviceId') {
				await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.legacy_token);
				setDeviceId(undefined);
				setIsInit(true);
				return;
			}
			// Set Device ID if found
			if (foundDeviceId) {
				setDeviceId(foundDeviceId);
				setIsInit(true);
				return;
			}
			if (foundLegacyToken) {
				// If we have a legacy token, migrate it to device ID
				await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.device_id, foundLegacyToken);
				// await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.legacy_token);
				setDeviceId(foundLegacyToken);
				setIsInit(true);
				return;
			}
			// Update state to initialized
			setIsInit(true);
		})();
	}, [isInit]);

	useEffect(() => {
		// Skip if no error
		if (!accountError) return;
		// Skip if error is not ACCOUNT_NOT_FOUND
		if (accountError.statusCode !== 404 || accountError.message !== 'ACCOUNT_NOT_FOUND') return;
		// This means the Device ID was not found, so we need to clear it
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

	function update(path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) {
		// Skip if no device ID
		if (!deviceId) return;
		// Skip if no account data
		if (!accountRef.current) return;
		// Transform the account data with the updated value
		const updatedAccountData = setValueAtPath(Object.assign({}, accountRef.current), path, value);
		// Get the current device index
		const currentDeviceIndex = accountRef.current.devices.findIndex(d => d.device_id === deviceId);
		if (currentDeviceIndex === -1) return;
		// Update device details on every update
		updatedAccountData.devices[currentDeviceIndex].app_version = Constants.expoConfig?.version || null;
		updatedAccountData.devices[currentDeviceIndex].brand = Device.brand;
		updatedAccountData.devices[currentDeviceIndex].name = Device.deviceName || null;
		updatedAccountData.devices[currentDeviceIndex].push_token = notificationsContext.data.token || null;
		updatedAccountData.devices[currentDeviceIndex].seen_last_at = Dates.now('Europe/Lisbon').unix_timestamp;
		// Update refs and state immediately
		accountRef.current = updatedAccountData;
		setAccountData(updatedAccountData);
		//
		// updateAccountApi(updatedAccountData);
		// Use SWR mutate to optimistically update the account data.
		// SWR accepts a function that receives the most up-to-date data
		// and returns the updated data to avoid stale data issues when
		// mutating with React state.
		// accountMutate(async (current) => {
		// 	// Skip if no current data
		// 	if (!current) return current;
		// 	// Send the updated data to the server.
		// 	// Any errors will be handled by SWR revalidation.
		// 	return await updateAccountApi(updatedAccountData);
		// }, {
		// 	populateCache: true,
		// 	revalidate: false,
		// });
	};

	const createAccount = async () => {
		// Skip if already initialized
		// or we have a Device ID
		if (!isInit || deviceId) return;
		// Fetch a new account from the server
		const newAccount = await fetchData<{ device_id: string }>(`${getServiceUrl('accounts')}/accounts/new`);
		if (!newAccount.data?.device_id) return;
		// Store the new Device ID in local storage
		await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.device_id, newAccount.data.device_id);
		// Update state
		setDeviceId(newAccount.data.device_id);
		setIsInit(true);
	};

	const deleteAccount = async () => {
		// Skip if no device ID
		if (!deviceId) return;
		// Send delete request to the server
		await fetchData(
			`${getServiceUrl('accounts')}/accounts`,
			'DELETE',
			null,
			{ Authorization: `Bearer ${deviceId}` },
		);
		// Clear local state
		setDeviceId(undefined);
		await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.device_id);
		await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.legacy_token);
		await accountMutate(undefined, { revalidate: false });
		// Reset initialization state
		setIsInit(false);
	};

	const favoriteLineId = (operation: 'add' | 'remove' | 'toggle', lineId: string) => {
		// Skip if no line ID
		if (!lineId) return;
		// Skip if no account data
		if (!accountRef.current?.favorites.line_ids) return;
		// Add a favorite line ID
		if (operation === 'add') {
			const currentLineIds = new Set(accountRef.current.favorites.line_ids || []);
			currentLineIds.add(lineId);
			update('favorites.line_ids', Array.from(currentLineIds));
		}
		// Remove a favorite line ID
		if (operation === 'remove') {
			const currentLineIds = new Set(accountRef.current.favorites.line_ids || []);
			currentLineIds.delete(lineId);
			update('favorites.line_ids', Array.from(currentLineIds));
		}
		// Toggle a favorite line ID
		if (operation === 'toggle') {
			const currentLineIds = new Set(accountRef.current.favorites.line_ids || []);
			if (currentLineIds.has(lineId)) currentLineIds.delete(lineId);
			else currentLineIds.add(lineId);
			update('favorites.line_ids', Array.from(currentLineIds));
		}
	};

	const favoriteStopId = (operation: 'add' | 'remove' | 'toggle', stopId: string) => {
		// Skip if no stop ID
		if (!stopId) return;
		// Skip if no account data
		if (!accountRef.current?.favorites.stop_ids) return;
		// Add a favorite stop ID
		if (operation === 'add') {
			const currentStopIds = new Set(accountRef.current.favorites.stop_ids || []);
			currentStopIds.add(stopId);
			update('favorites.stop_ids', Array.from(currentStopIds));
		}
		// Remove a favorite stop ID
		if (operation === 'remove') {
			const currentStopIds = new Set(accountRef.current.favorites.stop_ids || []);
			currentStopIds.delete(stopId);
			update('favorites.stop_ids', Array.from(currentStopIds));
		}
		// Toggle a favorite stop ID
		if (operation === 'toggle') {
			const currentStopIds = new Set(accountRef.current.favorites.stop_ids || []);
			if (currentStopIds.has(stopId)) currentStopIds.delete(stopId);
			else currentStopIds.add(stopId);
			update('favorites.stop_ids', Array.from(currentStopIds));
		}
	};

	//
	// D. Context value

	const contextValue: AccountContextState = useMemo(() => ({
		actions: {
			createAccount,
			deleteAccount,
			favoriteLineId,
			favoriteStopId,
			update,
		},
		data: {
			account: accountRef.current,
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
