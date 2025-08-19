// LocaleContext.tsx
import i18n from '@/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface LocaleContextState {
	actions: {
		changeLanguage: (lang: string) => void
		changeToEnglish: () => void
		changeToPortuguese: () => void
	}
	locale: string
}

const LOCALE_KEY = 'user_locale';
const LocaleContext = createContext<LocaleContextState | undefined>(undefined);

export const LocaleContextProvider = ({ children }: { children: ReactNode }) => {
	const [locale, setLocale] = useState(i18n.language);

	// On mount, read locale from AsyncStorage and set it
	useEffect(() => {
		const loadLocale = async () => {
			try {
				const storedLocale = await AsyncStorage.getItem(LOCALE_KEY);
				if (storedLocale && storedLocale !== i18n.language) {
					i18n.changeLanguage(storedLocale);
				}
			}
			catch (e) {
				console.error('Failed to load locale from AsyncStorage', e);
			}
		};
		loadLocale();
	}, []);

	useEffect(() => {
		const handleLanguageChanged = async (lng: string) => {
			setLocale(lng);
			try {
				await AsyncStorage.setItem(LOCALE_KEY, lng);
			}
			catch (e) {
				console.error('Failed to save locale to AsyncStorage', e);
			}
		};
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
