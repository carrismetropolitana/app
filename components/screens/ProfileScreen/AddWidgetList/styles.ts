/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const isLight = themeContext.theme.mode === 'light';
	const headerBackgroundColor = isLight ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;

	return StyleSheet.create({
		addFavoritesSection: {
			backgroundColor: headerBackgroundColor,
			paddingBottom: 20,
			paddingTop: 20,
		},
	});
};
export default styles;
