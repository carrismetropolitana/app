/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const isLight = themeContext.theme.mode === 'light';
	const fontColor = isLight ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		disabled: {
			opacity: 0.5,
		},
		listTitle: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '600',
		},
		sectionContainer: {
			marginBottom: 20,

		},
	});
};
export default styles;
