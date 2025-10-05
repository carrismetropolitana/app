/* * */

import { type Stop } from '@carrismetropolitana/api-types/network';

/* * */

export interface StopWithDistance extends Stop {
	distance?: number
};
