/* * */

import i18n from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

const LOCAL_STORAGE_KEYS = {
	locale: 'locale',
};

/* * */

interface LocaleContextState {
	actions: {
		changeLanguage: (lang: string) => void
	}
	data: {
		locale: string
	}
}

/* * */

const LocaleContext = createContext<LocaleContextState | undefined>(undefined);

export function useLocaleContext() {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error('useLocaleContext must be used within a LocaleContextProvider');
	}
	return context;
}

/* * */

export const LocaleContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [currentLocale, setCurrentLocale] = useState<string>(i18n.language);

	//
	// B. Fetch data

	useEffect(() => {
		(async () => {
			const foundLocale = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.locale);
			if (foundLocale) setCurrentLocale(foundLocale);
		})();
	}, []);

	//
	// C. Handle actions

	useEffect(() => {
		(async () => {
			i18n.changeLanguage(currentLocale);
			await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.locale, currentLocale);
		})();
	}, [currentLocale]);

	const changeLanguage = (lang: string) => {
		setCurrentLocale(lang);
	};

	//
	// C. Context value

	const contextValue: LocaleContextState = useMemo(() => ({
		actions: {
			changeLanguage,
		},
		data: {
			locale: currentLocale,
		},
	}), [currentLocale]);

	//
	// C. Render components

	return (
		<LocaleContext.Provider value={contextValue}>
			{children}
		</LocaleContext.Provider>
	);

	//
};
