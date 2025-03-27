/* * */

import { JSX } from 'react';

/* * */

export interface listItem {
	icon: JSX.Element
	id: number
	onPress?: () => void
	title: string
}
