/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	return StyleSheet.create({
		banner: {
			borderRadius: 8,
		},
		container: {
			flex: 1,
			fontFamily: 'Inter',
		},
		flatList: {
			marginBottom: 20,
			marginTop: 10,
			width: '100%',
		},
		icon: {
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
		},
		menuItem: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary,
		},
		safeArea: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			margin: 0,
			top: 0,
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
