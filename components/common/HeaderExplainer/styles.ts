/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundDark100 : theming.colorSystemBackgroundLight100;
	const secondaryFontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		firstHeader: {
			backgroundColor: backgroundColor,
			padding: 20,
		},
		heading: {
			color: fontColor,
			fontSize: 26,
			fontWeight: theming.fontWeightBold as '700',
			marginBottom: 8,

		},
		subheading: {
			color: secondaryFontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightText as '500',
			marginBottom: 8,
		},
	});
};
export default styles;
