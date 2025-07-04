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
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;
	//
	// B. Render Components

	return StyleSheet.create({
		explainerContainer: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-end',
			paddingBottom: 20,
			paddingRight: 20,
		},
		text: {
			color: fontColor,
			fontSize: 10,
			fontWeight: theming.fontWeightSubtitle as '600',
		},
	});

	//
};
