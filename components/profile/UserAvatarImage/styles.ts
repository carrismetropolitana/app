/* * */

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
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight100
		: theming.colorSystemBackgroundDark100;
	//
	// B. Render Components

	return StyleSheet.create({
		background: {
			height: '100%',
			opacity: 0.5,
			position: 'absolute',
			width: '100%',
		},
		container: {
			backgroundColor,
			borderRadius: 999,
			overflow: 'hidden',
		},
	});

	//
};
