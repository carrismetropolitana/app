/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		firstHeader: {
			backgroundColor: backgroundColor,
		},
	});
};
export default styles;
