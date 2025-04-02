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
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		safeArea: {
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
			flex: 1,
		},
		userDetails: {
			alignItems: 'center',
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
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
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
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
