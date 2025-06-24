/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;
	const borderColor = themeContext.theme.mode === 'light' ? theming.colorSystemBorder200 : theming.colorSystemBorderDark200;
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
		button: {
			backgroundColor: backgroundColor,
		},
		buttonContainer: {
			borderColor: borderColor,
			borderWidth: 1,
		},
		container: {
			backgroundColor: backgroundColor,
			paddingBottom: 20,
		},
		daysSelectors: {
			backgroundColor: selectorBackgroundColor,
			borderBottomWidth: 1,
			borderColor: borderColor,
			// borderWidth: 1,
			paddingBottom: 20,
			paddingHorizontal: 10,

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
			backgroundColor: selectorBackgroundColor,
			flexDirection: 'row',
			paddingHorizontal: 16,
		},
		input: {
			alignSelf: 'center',
			marginBottom: 0,
			width: '20%',
		},
		inputContent: {
			width: '100%',
		},
		lastSectionWrapper: {
			backgroundColor: selectorBackgroundColor,
			flexDirection: 'column',
		},

		lineDescriptionTitle: {
			marginBottom: 15,
			marginTop: 20,
			paddingHorizontal: 10,
		},

		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},

		muted: {
			color: fontColor,
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
			alignItems: 'center',
			backgroundColor: selectorBackgroundColor,
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'center',
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
		textLeft: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
			marginBottom: 20,
			marginLeft: 10,
			marginTop: 20,
		},
		timeSelectors: {
			alignItems: 'center',
			backgroundColor: selectorBackgroundColor,
			borderBottomWidth: 1,
			borderColor: borderColor,
			borderLeftWidth: 0,
			borderRightWidth: 0,
			borderTopWidth: 1,
			flexDirection: 'row',
			height: 80,
			justifyContent: 'space-between',
			paddingHorizontal: 20,
			width: '100%',
		},

		videoContainer: {
			marginBottom: 10,
		},

		warningContainer: {
			marginBottom: 10,
		},
		warningText: {
			color: fontColor,
			marginBottom: 20,
			textAlign: 'center',
		},
		warningTitle: {
			color: fontColor,
			fontWeight: theming.fontWeightBold as '700',
			marginBottom: 20,
			textAlign: 'center',
		},
	});
};
export default styles;
