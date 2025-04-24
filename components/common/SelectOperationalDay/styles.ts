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
	const fontColor = isLight
		? theming.colorSystemText300
		: theming.colorSystemText200;
	//
	// B. Render Components

	return StyleSheet.create({
		buttonSelected: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			borderColor: theming.colorSystemText200,
			borderRadius: 3,
			flex: 1,
			marginBottom: 5,
			marginLeft: 5,
			marginRight: 5,
			marginTop: 5,

		},
		container: {
			flex: 1,
			width: '100%',
		},
		operationalDayContainer: {
			backgroundColor: backgroundColor,
			height: 60,
		},
		text: {
			color: fontColor,
			fontSize: 16,
			fontWeight: '400',
		},
		textSelected: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: '400',
		},
	});

	//
};
