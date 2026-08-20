/* * */

import { type HubStop } from '@tmlmobilidade/go-types-public-info';

/* * */

export interface StopWithDistance extends HubStop {
	distance?: number
};
