/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const borderColor = theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;
	const backgroundColor = theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const fontColor = theme.mode === 'light' ? theming.colorSystemText100 : theming.colorSystemText300;

	return StyleSheet.create({
		container: {
			backgroundColor: backgroundColor,
			borderColor: borderColor,
			borderRadius: 6,
			borderWidth: 1,
			display: 'flex',
			flexDirection: 'column',
			gap: theming.sizeSpacing5,
			padding: theming.sizeSpacing15,
		},
		image: {
			borderRadius: 12,
			height: '100%',
			resizeMode: 'cover',
			width: '100%',
		},
		imageContainer: {
			elevation: 6,
			padding: 14,
			shadowColor: '#000',
			shadowOffset: { height: 0, width: 0 },
			shadowOpacity: 0.05,
			shadowRadius: 5,
			width: '100%',
		},
		list: {
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
		},
		/* * */
		/* TITLE */
		title: {
			color: fontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightBold as 'bold',
		},
		/* * */
		/* ICON */
		icon: {
			marginLeft: 4,
		},
	});
};
