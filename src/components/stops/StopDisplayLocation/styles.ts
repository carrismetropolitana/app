/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

/* LOCATION */
const location = {
	color: theming.colorSystemText300,
};

export const styles = StyleSheet.create({
	default: {
		...location,
	},
	lg: {
		...location,
		fontSize: 16,
		fontWeight: theming.fontWeightBold.toString() as 'bold',
	},

	md: {
		...location,
		fontSize: 15,
		fontWeight: theming.fontWeightBold.toString() as 'bold',
	},
});
