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
		avatarContainer: {
			backgroundColor,
		},
		avatartWrapper: {
			alignItems: 'center',
			backgroundColor: 'red',
			flex: 1,
			height: 500,
			justifyContent: 'center',
			width: 500,
		},
	});

	//
};
