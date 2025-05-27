/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		/* CONTAINER */
		container: {
			height: 65,
			marginBottom: 25,
			width: '100%',
			borderBottomWidth: 1,
			borderBottomColor: theming.colorSystemBorder100,

		},

		/* * */
		/* ITEM */

		item: {
			paddingTop: 10,
			paddingLeft: 35,
		},
	});
};
