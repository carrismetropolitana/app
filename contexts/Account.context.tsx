/* * */

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
		update: (data: Partial<Account>) => Promise<void>
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
			const foundAccountId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.account_id);
			if (foundAccountId) setAccountId(foundAccountId);
			setIsInit(true);
		})();
	}, []);

	const update = async (data: Partial<Account>) => {
		// Merge existing data with new data
		const mergedData = { ...accountData, ...data };
		// Send updated data to the server
		await fetchData(
			'https://accounts.carrismetropolitana.pt/accounts',
			'POST',
			JSON.stringify(mergedData),
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
