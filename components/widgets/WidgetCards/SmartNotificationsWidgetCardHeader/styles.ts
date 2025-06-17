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
			flexDirection: 'row',
			gap: 5,
			width: '90%',
		},
		/* * */
		/* HEADER TITLE */
		headerTitle: {
			color: fontColor,
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightTitle as '700',
		},
		/* * */
		/* HEADER SUBTITLE */
		headerSubtitle: {
			color: theming.colorSystemText200,
			fontSize: theming.fontSizeMuted,
			fontWeight: theming.fontWeightSemibold as '600',
		},

	});
};
