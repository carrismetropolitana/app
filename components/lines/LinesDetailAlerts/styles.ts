/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight ? theming.colorSystemText200 : theming.colorSystemText400;
	const backgroundColor = theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		alertWrapper: {
			backgroundColor: backgroundColor,
			gap: 30,
			height: 200,
			padding: 10,
			width: '100%',
		},
		titleText: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightBold as 'bold',
			marginTop: 25,
		},
	});
};
