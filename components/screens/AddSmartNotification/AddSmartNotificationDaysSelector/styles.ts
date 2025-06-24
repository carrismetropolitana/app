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
		button: {
			backgroundColor: backgroundColor,
		},
		buttonContainer: {
			borderColor: borderColor,
			borderWidth: 1,
		},
		daysSelectors: {
			backgroundColor: selectorBackgroundColor,
			borderBottomWidth: 1,
			borderColor: borderColor,
			paddingBottom: 20,
			paddingHorizontal: 10,
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
