/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	return StyleSheet.create({
		banner: {
			borderRadius: 8,
			marginBottom: 30,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		flatList: {
			marginBottom: 30,
			marginTop: 10,
			width: '100%',
		},
		icon: {
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
			height: 32,
			width: 32,
		},
		listTitle: {
			fontSize: 18,
			fontWeight: theming.fontWeightBold.toString() as 'bold',
		},
		safeArea: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,

			width: '100%',
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
};
export default styles;
