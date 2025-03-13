import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import pt from './translations/pt.json';

const resources = {
	en: { translation: en },
	pt: { translation: pt },
};

const matchedLocale = Localization.locale.startsWith('pt') ? 'pt' : 'en';

i18n.use(initReactI18next).init({
	fallbackLng: 'pt',
	interpolation: {
		escapeValue: false,
	},
	lng: matchedLocale,
	resources,
});

export default i18n;
