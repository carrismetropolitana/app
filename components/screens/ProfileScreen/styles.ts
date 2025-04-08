/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Setup variables
	const themeContext = useThemeContext();

	//
	// B. Return styles
	return StyleSheet.create({

		addFavoritesSection: {
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
		},
		avatarContainer: {
			borderColor: '#3D85C6',
			borderWidth: 8,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		/* LIST TITLE */
		listTitle: {
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightNav as '600',
		},
		/* * */
		safeArea: {
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
			flex: 1,
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
			fontWeight: 700,
		},
		userSection: {
			alignItems: 'center',
			flex: 1,
			justifyContent: 'center',
			paddingTop: 36,
		},
		userTypeText: {
			fontSize: 14,
			fontWeight: 700,
		},
		version: {
			color: '#aaa',
			fontSize: 12,
			marginBottom: 32 + 60,
			marginLeft: 16,
			marginTop: 8,
			textAlign: 'left',
		},
	});

	//
};
