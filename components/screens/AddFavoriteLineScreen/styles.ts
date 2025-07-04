/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		container: {
			backgroundColor: backgroundColor,
			paddingBottom: 50,
		},
		lineIdentifier: {
			fontSize: 14,
			fontWeight: theming.fontWeightBold as '700',
			padding: 13,
			textAlign: 'left',
		},

		listTitle: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '600',
		},
		overlay: {
			backgroundColor: backgroundColor,
			flex: 1,
		},
		sectionContainer: {
			marginBottom: 20,
			marginTop: 10,
		},
	});
};
export default styles;
