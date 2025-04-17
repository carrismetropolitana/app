/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	return StyleSheet.create({
		/* CONTAINER */
		container: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 20,
			width: '88%',
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
