// LocaleContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '@/i18n';

export interface LocaleContextState {
  locale: string;
  actions: {
    changeLanguage: (lang: string) => void;
    changeToEnglish: () => void;
    changeToPortuguese: () => void;
  };
}

const LocaleContext = createContext<LocaleContextState | undefined>(undefined);

export const LocaleContextProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with the current language from i18next
  const [locale, setLocale] = useState(i18n.language);

  // Listen for language changes on the i18n instance
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => setLocale(lng);
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // Function to change the language using i18next
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const contextValue: LocaleContextState = {
    locale,
    actions: {
      changeLanguage,
      changeToEnglish: () => changeLanguage('en'),
      changeToPortuguese: () => changeLanguage('pt'),
    },
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
