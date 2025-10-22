/* * */

import * as Localization from 'expo-localization';
import i18next from 'i18next';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo } from 'react';

/* * */

interface LocaleContextState {
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

	const locales = Localization.useLocales();

	//
	// B. Transform data

	const currentLocale = useMemo(() => {
		if (!locales || locales.length === 0) return 'pt';
		if (!locales[0].languageCode) return 'pt';
		return locales[0].languageCode;
	}, [locales]);

	//
	// C. Handle actions

	useEffect(() => {
		i18next.changeLanguage(currentLocale);
	}, [currentLocale]);

	//
	// D. Context value

	const contextValue: LocaleContextState = useMemo(() => ({
		data: {
			locale: currentLocale,
		},
	}), [currentLocale]);

	//
	// E. Render components

	return (
		<LocaleContext.Provider value={contextValue}>
			{children}
		</LocaleContext.Provider>
	);

	//
};
