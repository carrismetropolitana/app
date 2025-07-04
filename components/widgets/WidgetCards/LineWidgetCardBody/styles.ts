/* * */

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
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	return StyleSheet.create({
		/* CONTAINER */
		container: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'center',
		},
		/* * */
		/* HEADER TITLE */
		headerTitle: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightSemibold as '700',

		},
	});
};
