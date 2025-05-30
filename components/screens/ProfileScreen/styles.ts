/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark200;
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;
	const buttonBackgroundColor = theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const titleColor = theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		addFavoritesSection: {
			paddingTop: 20,
		},
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
		container: {
			backgroundColor: backgroundColor,
		},
		goBackHeader: {
			alignContent: 'flex-start',
			alignItems: 'flex-start',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			padding: 20,
		},
		goBackHeaderText: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '500',
		},
		listTitle: {
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightNav as '600',
		},
		nameRow: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 3,
			paddingBottom: 8,
		},
		nameText: {
			marginRight: 8,
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
