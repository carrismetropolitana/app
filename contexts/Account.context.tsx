/* * */

import { type Account } from '@/types/account.types';
import { type Widget, type WidgetLine, type WidgetSmartNotification, type WidgetStop } from '@/types/widget.types';
import { fetchData } from '@/utils/fetchData';
import { swrFetcher } from '@/utils/swr-fetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

const LOCAL_STORAGE_KEYS = {
	device_id: 'token',
};

/* * */

interface AccountContextState {
	actions: {
		createWidgetLine: (config: WidgetLine) => Promise<void>
		createWidgetSmartNotification: (config: WidgetSmartNotification) => Promise<void>
		createWidgetStop: (config: WidgetStop) => Promise<void>
	}
	data: {
		account: Account | undefined
		device_id: string | undefined
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
	const [deviceId, setDeviceId] = useState<string | undefined>();

	//
	// B. Fetch data

	const { data: accountData, isLoading: accountLoading, mutate: accountMutate } = useSWR<Account>({ token: deviceId, url: deviceId && 'https://accounts.carrismetropolitana.pt/accounts' }, swrFetcher, { refreshInterval: 1000 });

	//
	// C. Handle actions

	useEffect(() => {
		(async () => {
			const foundDeviceId = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.device_id);
			if (foundDeviceId) setDeviceId(foundDeviceId);
			setIsInit(true);
		})();
	}, []);

	const updateAccount = async (data: Partial<Account>) => {
		// Merge existing data with new data
		const mergedData = { ...accountData, ...data };
		// Send updated data to the server
		await fetchData(
			'https://accounts.carrismetropolitana.pt/accounts',
			'POST',
			JSON.stringify(mergedData),
			{ 'Authorization': `Bearer ${deviceId}`, 'Content-Type': 'application/json' },
		);
		// Revalidate SWR data
		accountMutate();
	};

	const createWidgetStop = async (widgetData: WidgetStop, label?: string) => {
		// Prepare the new widget data
		const preparedWidget: Widget = {
			data: widgetData,
			id: 'random-id',
			label: label ?? null,
			settings: {
				display_order: 0,
				is_open: true,
			},
		};
		// Get current widgets and append the new one
		const currentWidgets = accountData?.widgets || [];
		// Update the account with the new widgets array
		await updateAccount({ widgets: [...currentWidgets, preparedWidget] });
		// Revalidate SWR data
		accountMutate();
	};

	const createWidgetLine = async (config: WidgetLine) => {
		console.log('createWidgetLine', config);
		accountMutate();
	};

	const createWidgetSmartNotification = async (config: WidgetSmartNotification) => {
		console.log('createWidgetSmartNotification', config);
		accountMutate();
	};

	//
	// C. Context value

	const contextValue: AccountContextState = useMemo(() => ({
		actions: {
			createWidgetLine,
			createWidgetSmartNotification,
			createWidgetStop,
		},
		data: {
			account: accountData,
			device_id: deviceId,
		},
		flags: {
			init: isInit,
			loading: !isInit || accountLoading,
		},
	}), [
		deviceId,
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
