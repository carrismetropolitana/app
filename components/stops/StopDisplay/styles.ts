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
		flexWrap: 'wrap',	
	} as const;

	return StyleSheet.create({
		/* * */
		/* CONTAINER */
		container: {
			...container,
			backgroundColor: backgroundColor,
			width: '100%',
		},

		// /* * */
		// /* CONTAINER / MODIFIERS */
		lg: {
			...container,
			fontSize: 22,},
		md: {
			...container,
			fontSize: 16,
		},

		// /* * */
	});
};
