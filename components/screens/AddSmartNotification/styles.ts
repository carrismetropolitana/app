/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;
	const mutedFontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText300 : theming.colorSystemText200;
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
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
			backgroundColor: backgroundColor,
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
			fontWeight: theming.fontWeightSemibold as '600',
		},
		header: {
			alignItems: 'center',
			flexDirection: 'row',
			paddingHorizontal: 16,
		},
		input: {
			width: '20%',
		},
		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},
		muted: {
			color: mutedFontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},
		overlay: {
			backgroundColor: backgroundColor,
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

		selectNotificationContol: {
			backgroundColor: selectorBackgroundColor,
			flexDirection: 'row',
			paddingHorizontal: 10,
			paddingVertical: 10,
		},

		svg: {
			marginBottom: 20,
			marginTop: 20,
		},
		text: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
			justifyContent: 'center',
			marginBottom: 10,
			textAlign: 'center',
		},
		videoContainer: {
			marginBottom: 10,
		},
	});
};
export default styles;
