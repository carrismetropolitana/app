/* * */

import { useNotificationsContext } from '@/contexts/Notifications.context';
import { Dates, type DotPath, generateRandomString, HttpException, type PathValue, setValueAtPath } from '@/core-replica';
import { type Account } from '@/schemas/account';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { createContext, type PropsWithChildren, RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
		ref: RefObject<Account | undefined>
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

	/**
	 * Update account data when fetched data changes.
	 */
	useEffect(() => {
		// Skip if no fetched data
		if (!fetchedAccountData) return;
		// Update refs and state
		accountRef.current = fetchedAccountData;
		setAccountData(fetchedAccountData);
	}, [fetchedAccountData]);

	/**
	 * Initialize Device ID from local storage.
	 */
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

	/**
	 * Handle ACCOUNT_NOT_FOUND error.
	 */
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

	/**
	 * Sync device details at regular intervals,
	 * or whenever the device ID or notification token changes.
	 */
	useEffect(() => {
		// Sync immediately
		sync();
		// Set interval to sync regularly
		const interval = setInterval(() => sync(), 10_000); // Every 10 seconds
		// Cleanup on unmount
		return () => clearInterval(interval);
	}, [deviceId, notificationsContext.data.token]);

	/**
	 * Update account data on the server.
	 * @param updatedAccountData The account data to update.
	 * @returns A promise that resolves to the updated account data from the server.
	 */
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

	/**
	 * Sync device details with the server.
	 * This function updates the device information on the server
	 * with the notifications token and device info. It should be called
	 * on a regular interval to keep the server updated.
	 */
	function sync() {
		// Skip if no device ID
		if (!deviceId) return;
		// Skip if no account data
		if (!accountRef.current) return;
		// Get the current device index
		const currentDeviceIndex = accountRef.current.devices.findIndex(d => d.device_id === deviceId);
		if (currentDeviceIndex === -1) return;
		// Update device details on every update
		accountRef.current.devices[currentDeviceIndex].app_version = Constants.expoConfig?.version || null;
		accountRef.current.devices[currentDeviceIndex].brand = Device.brand;
		accountRef.current.devices[currentDeviceIndex].name = Device.deviceName || null;
		accountRef.current.devices[currentDeviceIndex].push_token = notificationsContext.data.token || null;
		accountRef.current.devices[currentDeviceIndex].seen_last_at = Dates.now('Europe/Lisbon').unix_timestamp;
		// Update state with the updated account data
		setAccountData(accountRef.current);
		// Use SWR mutate to optimistically update the account data.
		// SWR accepts a function that receives the most up-to-date data
		// and returns the updated data to avoid stale data issues when
		// mutating with React state.
		accountMutate(async () => {
			// Skip if no current data
			if (!accountRef.current) return;
			// Log the sync operation
			console.log(generateRandomString(), 'Syncing account data with server...');
			// Send the updated data to the server.
			// Any errors will be handled by SWR revalidation.
			return await updateAccountApi(accountRef.current);
		}, {
			populateCache: true,
			revalidate: false,
		});
	};

	/**
	 * Update a specific path in the account data.
	 * This function will optimistically update the account data in the client
	 * and send the updated data to the server.
	 * @param path The path to update.
	 * @param value The new value to set.
	 */
	function update(path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) {
		// Skip if no device ID
		if (!deviceId) return;
		// Skip if no account data
		if (!accountRef.current) return;
		// Transform the account data with the updated value
		const updatedAccountData = setValueAtPath(Object.assign({}, accountRef.current), path, value);
		// Update refs and state immediately
		accountRef.current = updatedAccountData;
		setAccountData(updatedAccountData);
		// Trigger a sync to update device details
		sync();
	};

	/**
	 * Create a new account on the server.
	 */
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

	/**
	 * Delete the current account from the server.
	 */
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
		await accountMutate();
		// Clear refs and state
		accountRef.current = undefined;
		setAccountData(undefined);
		// Reset initialization state
		setIsInit(false);
	};

	/**
	 * Manage favorite line IDs.
	 * @param operation 'add' | 'remove' | 'toggle'
	 * @param lineId The line ID to manage.
	 */
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

	/**
	 * Manage favorite stop IDs.
	 * @param operation 'add' | 'remove' | 'toggle'
	 * @param stopId The stop ID to manage.
	 */
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
			account: accountData,
			device_id: deviceId,
			ref: accountRef,
		},
		flags: {
			anonymous: isInit && !deviceId,
			error: !!deviceId && !!accountError,
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
