/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const isLight = themeContext.theme.mode === 'light';
	const backgroundColor = isLight ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const headerBackgroundColor = isLight ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		button: {
			alignSelf: 'center',
			backgroundColor: buttonBackgroundColor,
			borderRadius: 999,
			flexDirection: 'row',
		},
		buttonContainer: {
			backgroundColor: backgroundColor,
			paddingTop: 10,
		},
		buttonTitle: {
			color: titleColor,
			fontSize: theming.fontSizeMuted,
			fontWeight: theming.fontWeightSemibold as '600',
		},
		favoritesListSection: {
			backgroundColor: headerBackgroundColor,
			paddingTop: 20,
		},
		userFullNameText: {
			color: fontColor,
			fontSize: 26,
			fontWeight: '700',
		},
		userSection: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			justifyContent: 'center',
			marginBottom: 20,
			paddingBottom: 20,
			paddingTop: 36,
		},
	});
};
export default styles;
