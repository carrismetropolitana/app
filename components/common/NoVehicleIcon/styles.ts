import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Setup variables

	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	//
	// B. Render Components

	return StyleSheet.create({
		/* * */
		/* CONTAINER */

		container: {
			alignItems: 'center',
			backgroundColor: theming.colorRealtime100,
			borderRadius: 999,
			color: theming.colorRealtime100,
			height: 10,
			justifyContent: 'center',
			width: 10,
		},

		/* * */
		/* DOT */

		dot: {
			width: 10,
			/* DOT SIZE */
			backgroundColor: theming.colorSystemText200,

			borderRadius: 999,
			height: 10,
			opacity: 1,
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
