/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const borderColor = theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	return StyleSheet.create({
		/* CONTAINER */
		container: {
			borderBottomColor: borderColor,
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
