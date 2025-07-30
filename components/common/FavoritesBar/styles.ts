/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const insets = useSafeAreaInsets();
	const borderColor = theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;

	return StyleSheet.create({
		/* CONTAINER */
		container: {
			borderBottomColor: borderColor,
			borderBottomWidth: 1,
			height: 65,
			marginTop: 100 + insets.top,
			width: '100%',
		},

		/* * */
		/* ITEM */

		item: {
			paddingLeft: 20,
			paddingTop: 6,
		},
	});
};
