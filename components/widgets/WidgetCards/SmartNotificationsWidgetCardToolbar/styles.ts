/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText200
		: theming.colorSystemText300;
	const borderColor = isLight ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	return StyleSheet.create({
		/* CONTAINER */
		container: {
			borderBottomWidth: 2,
			borderColor: borderColor,
			borderTopWidth: 2,
			flexDirection: 'row',
			gap: 25,
			justifyContent: 'space-between',
			marginBottom: 10,
			marginTop: 10,
			padding: 20,
		},
		/* * */
		/* TEXT */
		text: {
			color: fontColor,
			fontSize: 16,
			fontWeight: 'bold',
		},
		/* * */
		/* TEXT UNSELECTED */
		textUnselected: {
			color: '#F0F0FA',
			fontSize: 16,
			fontWeight: 'bold',
		},

	});
};
