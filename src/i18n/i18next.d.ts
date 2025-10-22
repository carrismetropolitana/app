/* * */

import { resourceKeys } from '@/i18n';

/* * */

declare module 'i18next' {
	interface CustomTypeOptions {
		resources: typeof resourceKeys['en']
	}
}
