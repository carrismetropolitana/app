import enKeys from './translations/en.json';
import ptKeys from './translations/pt.json';

export const resources = {
	en: { translation: enKeys },
	pt: { translation: ptKeys },
} as const;

export type DefaultResources = typeof resources['en'];
