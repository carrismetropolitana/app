/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		/* CONTAINER */
		container: {
			borderBottomColor: theming.colorSystemBorder100,
			borderBottomWidth: 1,
			height: 65,
			left: 0,
			marginBottom: 25,
			width: '100%',
		},

		/* * */
		/* ITEM */

		item: {
			paddingLeft: 35,
			paddingTop: 10,
		},
	});
};
