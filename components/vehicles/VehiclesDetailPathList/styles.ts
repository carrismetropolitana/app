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
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;
	//
	// B. Render Components

	return StyleSheet.create({
		/* * */
		/* CONTAINER */

		container: {
			borderBottomLeftRadius: theming.borderRadiusLg,
			borderTopLeftRadius: theming.borderRadiusLg,
			flex: 1,
			flexDirection: 'column',
			overflow: 'hidden',
		},

		/* * */
	});

	//
};
