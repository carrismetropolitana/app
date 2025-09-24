/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();
	const borderColor = themeContext.theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	return StyleSheet.create({
		container: {
			borderColor: borderColor,
			borderWidth: 1,
			overflow: 'hidden',
		},
		grip: {
			marginRight: 12,
			padding: 8,
		},
		inner: {
			alignItems: 'center',
			flexDirection: 'row',
			padding: 12,
		},
		wrapper: {
			// paddingHorizontal: 8,
			// paddingVertical: 4,
			width: '100%',
		},
	});
};
export default styles;
