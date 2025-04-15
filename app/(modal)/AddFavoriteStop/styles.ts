/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

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
			flex: 1,
			height: '100%',
			marginTop: 20,
			maxWidth: '100%',
			minWidth: '100%',
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
		videoContainer: {
			marginBottom: 20,
			padding: 0,
			width: '100%',
		},
	});
};
export default styles;
