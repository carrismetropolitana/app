/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Dimensions, StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { width } = Dimensions.get('window');
	const { theme } = useThemeContext();
	const borderColor = theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	return StyleSheet.create({
		image: {
			borderRadius: 12,
			height: '100%',
			resizeMode: 'cover',
			width: '100%',
		},
		imageContainer: {
			alignItems: 'center',
			elevation: 6,
			justifyContent: 'center',
			padding: 14,
			shadowColor: '#000',
			shadowOffset: { height: 0, width: 0 },
			shadowOpacity: 0.05,
			shadowRadius: 5,
			width,
		},
		list: {
			height: 250,
		},
	});
};
