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
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	//
	// B. Render Components

	return StyleSheet.create({
		avatarContainer: {
			backgroundColor,
			borderColor: theming.colorBrand,
			borderWidth: 3,
		},
	});

	//
};
