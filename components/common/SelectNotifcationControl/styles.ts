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
			borderRadius: 3,
			boxShadow: '0 0 5 0 rgba(0, 0, 0, 0.1)',
			marginBottom: 5,
			marginLeft: 5,
			marginRight: 5,
			marginTop: 5,

		},
		container: {
			alignSelf: 'stretch',
			borderRadius: 3,
			width: '40%',
		},
		operationalDayContainer: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			borderWidth: 0,
			height: 60,
			justifyContent: 'space-around',
		},
		text: {
			color: fontColor,
			fontSize: 12,
			fontWeight: '400',
		},
		textSelected: {
			color: theming.colorSystemText200,
			fontSize: 14,
			fontWeight: '400',
		},
	});

	//
};
