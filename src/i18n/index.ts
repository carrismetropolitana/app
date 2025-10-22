/* * */

import i18next from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

/* * */

import enKeys from '@/i18n/translations/en.json';
import ptKeys from '@/i18n/translations/pt.json';

/* * */

export const resourceKeys = {
	en: { translation: enKeys },
	pt: { translation: ptKeys },
} as const;

/* * */

i18next
	.use(ICU)
	.use(initReactI18next)
	.init({
		fallbackLng: 'pt',
		resources: resourceKeys,
	});
