/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText200
		: theming.colorSystemText300;

	return StyleSheet.create({
		/* * */
		/* LIST TITLE */
		listTitle: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '600',
		},

	});
};
