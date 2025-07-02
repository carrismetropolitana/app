/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		saveButton: {
			backgroundColor: theming.colorBrand,
			borderRadius: 30,
			borderWidth: 0,
			marginBottom: 20,
			width: '100%',
		},

		saveButtonText: {
			borderWidth: 0,
			color: '#000000',
			fontSize: 16,
			fontWeight: '600',
		},
	});
};
export default styles;
