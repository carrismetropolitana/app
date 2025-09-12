/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

const styles = () => {
	const themeContext = useThemeContext();
	const isLight = themeContext.theme.mode === 'light';
	const backgroundColor = isLight ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		activity: {
			fontSize: 16,
			fontWeight: '700',
			textTransform: 'uppercase',
		},
		button: {
			backgroundColor: buttonBackgroundColor,
			borderRadius: 999,
			flexDirection: 'row',
		},
		buttonContainer: {
			backgroundColor: backgroundColor,
			marginTop: 15,
		},
		buttonTitle: {
			color: titleColor,
			fontSize: theming.fontSizeMuted,
			fontWeight: theming.fontWeightSemibold as '600',
		},
		container: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			paddingBottom: 30,
			paddingTop: 30,
		},
		displayName: {
			color: fontColor,
			fontSize: 28,
			fontWeight: '700',
			marginTop: 10,
		},
	});
};

export default styles;
