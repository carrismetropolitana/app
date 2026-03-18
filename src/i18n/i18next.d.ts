/* * */

import 'i18next';
import type { DefaultResources } from './resources';

/* * */
declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'translation'
		enableSelector: 'optimize'
		resources: DefaultResources
		returnNull: false
	}
}
