/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight100
		: theming.colorSystemBackgroundDark100;

	const container = {
		alignItems: 'flex-start',
		display: 'flex',
		flexDirection: 'column',
		gap: theming.sizeSpacing5,
		justifyContent: 'flex-start',
	} as const;

	return StyleSheet.create({
		/* * */
		/* CONTAINER */
		container: {
			...container,
			backgroundColor: backgroundColor,
		},

		// /* * */
		// /* CONTAINER / MODIFIERS */
		lg: {
			...container,
			fontSize: 22,
			maxHeight: 26,
			maxWidth: 65,
			minHeight: 26,
			minWidth: 65 },
		md: {
			...container,
			fontSize: 16,
			maxHeight: 26,
			maxWidth: 65,
			minHeight: 26,
			minWidth: 65,
		},

		// /* * */
	});
};
