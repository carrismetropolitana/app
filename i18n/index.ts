// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import your translation JSON files
import en from './translations/en.json';
import pt from './translations/pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const matchedLocale = Localization.locale.startsWith('pt') ? 'pt' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: matchedLocale,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
