/* * */

import { type DotPath, type PathValue, setValueAtPath } from '@/core-replica/set-value-at-path';
import { type Account } from '@/schemas/account';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const LOCAL_STORAGE_KEYS = {
	account_id: 'token',
};

/* * */

interface AccountContextState {
	actions: {
		update: (path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) => Promise<void>
	}
	data: {
		account: Account | undefined
		account_id: string | undefined
	}
	flags: {
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

	const [isInit, setIsInit] = useState<boolean>(false);
	const [accountId, setAccountId] = useState<string | undefined>();

	//
	// B. Fetch data

	const { data: accountData, isLoading: accountLoading, mutate: accountMutate } = useSWR<Account>({ accountId: accountId, url: accountId && 'https://accounts.carrismetropolitana.pt/accounts' }, swrFetcher, { refreshInterval: 1000 });

	//
	// C. Handle actions

	useEffect(() => {
		(async () => {
			// Skip if already initialized
			if (isInit) return;
			// Try to get Account ID from local storage
			const foundAccountId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.account_id);
			// Set Account ID if found
			if (foundAccountId) setAccountId(foundAccountId);
			// Mark as initialized
			setIsInit(true);
		})();
	}, [isInit]);

	useEffect(() => {
		(async () => {
			// Skip if not yet initialized
			if (!isInit) return;
			// Skip if Account ID already exists
			if (accountId) return;
			// Fetch new Account ID from the server
			const newAccount = await fetchData<Account>('https://accounts.carrismetropolitana.pt/accounts');
			// Save new Account ID to local storage and state
			if (!newAccount?.data?._id) return;
			setAccountId(newAccount.data._id);
			await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.account_id, newAccount.data._id);
		})();
	}, [isInit]);

	const update = async (path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) => {
		if (!accountData || !accountId) return;
		// Merge existing data with new data
		const updatedAccountData = setValueAtPath(Object.assign({}, accountData), path, value);
		// Send updated data to the server
		await fetchData(
			'https://accounts.carrismetropolitana.pt/accounts',
			'PUT',
			JSON.stringify(updatedAccountData),
			{ 'Authorization': `Bearer ${accountId}`, 'Content-Type': 'application/json' },
		);
		// Revalidate SWR data
		accountMutate();
	};

	//
	// C. Context value

	const contextValue: AccountContextState = useMemo(() => ({
		actions: {
			update,
		},
		data: {
			account: accountData,
			account_id: accountId,
		},
		flags: {
			init: isInit,
			loading: !isInit || accountLoading,
		},
	}), [
		isInit,
		accountId,
		accountData,
		accountLoading,
	]);

	//
	// C. Render components

	return (
		<AccountContext.Provider value={contextValue}>
			{children}
		</AccountContext.Provider>
	);

	//
};
