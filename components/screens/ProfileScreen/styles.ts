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

	return StyleSheet.create({
		addFavoritesSection: {
			backgroundColor,
		},
		avatarContainer: {
			borderColor: '#3D85C6',
			borderWidth: 8,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		listTitle: {
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightNav as '600',
		},
		userDetails: {
			alignItems: 'center',
			gap: 6,
			justifyContent: 'center',
			paddingVertical: 24,
		},
		userFullNameText: {
			color: theming.colorSystemText100,
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
			fontSize: 14,
			fontWeight: '700',
		},
	});
};
