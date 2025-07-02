/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const selectorBackgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		arrow: {
			color: '#3D85C6',
			fontSize: 20,
			marginRight: 6,
		},
		backButton: {
			alignItems: 'center',
			flexDirection: 'row',
		},
		backText: {
			color: '#3D85C6',
			fontSize: 16,
			fontWeight: '500',
		},
		container: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			paddingBottom: 50,
		},
		deleteButton: {
			backgroundColor: theming.colorAlerts3,
			borderRadius: 30,
			color: '#FFFFFF',
		},
		deleteButtonText: {
			color: '#FFFFFF',
			fontSize: 16,
			fontWeight: '600',
		},
		firstHeader: {
			backgroundColor: selectorBackgroundColor,
		},
		header: {
			alignItems: 'center',
			flexDirection: 'row',
			paddingHorizontal: 16,
		},
		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: '600',
		},

		overlay: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
		},



	});
};
export default styles;
