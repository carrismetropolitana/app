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
		avatartWrapper: {
			width: 500,
			height: 500,
			flex: 1,
			backgroundColor: 'red',
			justifyContent: 'center',
			alignItems: 'center',
		},
		avatarContainer: {
			backgroundColor,
		},
	});

	//
};
