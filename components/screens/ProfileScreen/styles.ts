/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	return StyleSheet.create({
		addFavoritesSection: {
			backgroundColor: backgroundColor,
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
		},
	});
};
