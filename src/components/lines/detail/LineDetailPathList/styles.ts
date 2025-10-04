import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		/* * */
		/* CONTAINER */

		container: {
			borderBottomLeftRadius: theming.borderRadiusLg,
			borderTopLeftRadius: theming.borderRadiusLg,
			flex: 1,
			flexDirection: 'column',
			overflow: 'hidden',
		},

		/* * */
	});

	//
};
