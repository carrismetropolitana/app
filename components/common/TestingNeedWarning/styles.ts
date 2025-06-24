/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
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
