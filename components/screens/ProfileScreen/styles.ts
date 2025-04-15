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
			backgroundColor,
		},
		avatarContainer: {
			borderColor: '#3D85C6',
			borderWidth: 8,
		},
		container: {
			backgroundColor,
			flex: 1,
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
		userDetails: {
			alignItems: 'center',
			gap: 6,
			justifyContent: 'center',
			paddingVertical: 24,
		},
		userFullNameText: {
			color: fontColor,
			fontSize: 26,
			fontWeight: '700',
		},
		userSection: {
			alignItems: 'center',
			flex: 1,
			justifyContent: 'center',
			paddingTop: 36,
		},
		userTypeText: {
			color: '#3D85C6',
			fontSize: 14,
			fontWeight: '700',
		},
	});
};
