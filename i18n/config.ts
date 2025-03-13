// config.ts
export const availableLocales = [
	{
		alias: ['pt-PT', 'pt_PT', 'pt-BR', 'pt_BR', 'pt-GW', 'pt-MZ'],
		enabled: true,
		value: 'pt',
	},
	{
		alias: ['en-US', 'en_US', 'en-GB', 'en_GB'],
		enabled: true,
		value: 'en',
	},
];

export const enabledLocaleCodes = availableLocales
	.filter(item => item.enabled)
	.map(({ value }) => value);

export const enabledLocaleAliases = availableLocales
	.filter(item => item.enabled)
	.flatMap(({ alias }) => alias);

export const allEnabledLocaleCodesAndAliases = [
	...enabledLocaleCodes,
	...enabledLocaleAliases,
];

export const defaultLocaleCode = 'pt';
export const defaultLocaleAliases
    = availableLocales.find(item => item.value === defaultLocaleCode)?.alias || [];
export const defaultLocaleCodesAndAliases = [
	defaultLocaleCode,
	...defaultLocaleAliases,
];
