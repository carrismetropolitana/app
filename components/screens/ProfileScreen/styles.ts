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
	const buttonBackgroundColor = theme.mode === 'light' ? theming.colorSystemBackgroundLight200: theming.colorSystemBackgroundDark200;
	const titleColor = theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		addFavoritesSection: {
			paddingTop: 20,
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
			justifyContent: 'center',
			paddingTop: 36,
			paddingBottom: 20,
			marginBottom: 20,
			backgroundColor: backgroundColor,
		},
		goBackHeader: {
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
			alignContent: 'flex-start',
			padding: 20,
			flexDirection: 'row',
		},
		goBackHeaderText: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '500',
		},
		button: {
			borderRadius: 999,
			flexDirection: 'row',
			alignSelf: 'center',
			backgroundColor: buttonBackgroundColor
		},
		buttonTitle: {
			color: titleColor,
			fontWeight: theming.fontWeightSemibold as '600',
			fontSize: theming.fontSizeMuted
		},
		buttonContainer:{
			backgroundColor: backgroundColor,
			paddingTop: 10
		}
	});
};
