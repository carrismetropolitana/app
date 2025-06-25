// LocaleContext.tsx
import i18n from '@/i18n';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface LocaleContextState {
	actions: {
		changeLanguage: (lang: string) => void
		changeToEnglish: () => void
		changeToPortuguese: () => void
	}
	locale: string
}

const LocaleContext = createContext<LocaleContextState | undefined>(undefined);

export const LocaleContextProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocale] = useState(i18n.language);

	useEffect(() => {
		const handleLanguageChanged = (lng: string) => setLocale(lng);
		i18n.on('languageChanged', handleLanguageChanged);
		return () => {
			i18n.off('languageChanged', handleLanguageChanged);
		};
	}, []);

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	const contextValue: LocaleContextState = {
		actions: {
			changeLanguage,
			changeToEnglish: () => changeLanguage('en'),
			changeToPortuguese: () => changeLanguage('pt'),
		},
		locale,
	};

	return (
		<LocaleContext.Provider value={contextValue}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocaleContext = () => {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error('useLocaleContext must be used within a LocaleContextProvider');
	}
	return context;
};
