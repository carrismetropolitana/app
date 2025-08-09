import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	return StyleSheet.create({
		/* * */
		/* CONTAINER */

		container: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			borderRadius: 999,
			color: theming.colorSystemText200,
			justifyContent: 'center',

		},

		/* * */
		/* DOT */

		dot: {
			/* DOT SIZE */
			backgroundColor: theming.colorSystemText200,
			borderRadius: 999,
			height: 5,
			opacity: 1,
			width: 5,
		},

		/* * */
		/* RIPPLE */

		ripple: {
			backgroundColor: theming.colorSystemBorder200,
			position: 'absolute',
			/* RIPPLE SIZE */
			borderRadius: 999,
			height: 20,
			opacity: 0.3,
			width: 20,
		},

	});

	//
};
