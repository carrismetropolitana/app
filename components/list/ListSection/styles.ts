/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const themeContext = useThemeContext();
	return StyleSheet.create({
		container: {
			flex: 1,
			paddingBottom: 10,
			paddingTop: 30,
			width: '100%',
		},
		itemsWrapper: {
			backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100,
			borderTopColor: 'rgb(230 230 250)',
			borderTopWidth: 1,
			flex: 1,
			paddingBottom: 0,
			width: '100%',
		},
		title: {
			color: themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorPrimaryWhite,
			fontSize: 16,
			fontWeight: 600,
			paddingBottom: 10,
			paddingLeft: 20,
		},
	});
};
