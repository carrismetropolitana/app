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
	const selectorBackgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		input: {
			alignSelf: 'center',
			marginBottom: 0,
			width: '20%',
		},
		inputContent: {
			width: '100%',
		},
		text: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
			justifyContent: 'center',
			marginBottom: 10,
			textAlign: 'center',
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
	});
};
export default styles;
