/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const selectorBackgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		container: {
			backgroundColor: backgroundColor,
			paddingBottom: 60,
		},
		input: {
			alignSelf: 'center',
			marginBottom: 0,
			width: '20%',
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

		overlay: {
			backgroundColor: backgroundColor,
		},
		scrollContent: {
			flexGrow: 1,
			paddingBottom: 60, // if you still want that bottom space
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
	});
};
export default styles;
