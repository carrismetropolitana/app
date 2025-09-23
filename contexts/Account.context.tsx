/* * */

import { type DotPath, HttpException, type PathValue, setValueAtPath } from '@/core-replica';
import { type Account } from '@/schemas/account';
import { getServiceUrl } from '@/settings/service-urls';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const LOCAL_STORAGE_KEYS = {
	account_id: 'account_id',
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

	const { data: accountData, error: accountError, isLoading: accountLoading, mutate: accountMutate } = useSWR<Account, HttpException>({ accountId: accountId, url: `${getServiceUrl('accounts')}/accounts` }, swrFetcher, { refreshInterval: 10_000 });

	//
	// C. Handle actions

	useEffect(() => {
		(async () => {
			// Skip if already initialized
			if (isInit) return;
			// Try to get Account ID from local storage
			const foundAccountId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.account_id);
			// Set Account ID if found...
			if (foundAccountId) {
				setAccountId(foundAccountId);
				setIsInit(true);
				return;
			}
			// ...or else fetch a new one from the server
			const newAccount = await fetchData<Account>(`${getServiceUrl('accounts')}/accounts/new`);
			if (!newAccount?.data?._id) return;
			await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.account_id, newAccount.data._id);
			setAccountId(newAccount.data._id);
			setIsInit(true);
		})();
	}, [isInit]);

	useEffect(() => {
		// Skip if no error
		if (!accountError) return;
		// Skip if error is 404 (Not Found)
		if (accountError.statusCode !== 404) return;
		// This means the account ID is invalid, so we need to clear it
		AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.account_id);
		setAccountId(undefined);
		setIsInit(false);
	}, [accountError]);

	async function update(path: DotPath<Account>, value: PathValue<Account, DotPath<Account>>) {
		if (!accountData || !accountId) return;
		// Update local copy of the data
		const updatedAccountData = setValueAtPath(Object.assign({}, accountData), path, value);
		// Update local SWR data immediately (optimistic update)
		accountMutate(updatedAccountData, { revalidate: false });
		// Send updated data to the server
		const response = await fetchData<Account>(
			`${getServiceUrl('accounts')}/accounts`,
			'PUT',
			updatedAccountData,
			{ 'Authorization': `Bearer ${accountId}`, 'Content-Type': 'application/json' },
		);
		if (!response.data) return;
		// Revalidate SWR data
		accountMutate(response.data);
	};

	//
	// D. Context value

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
	// E. Render components

	return (
		<AccountContext.Provider value={contextValue}>
			{children}
		</AccountContext.Provider>
	);

	//
};
