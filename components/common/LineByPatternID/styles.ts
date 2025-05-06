/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	return StyleSheet.create({
		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: '600',
		},
	});
};
export default styles;
