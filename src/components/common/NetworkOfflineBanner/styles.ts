/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText900
		: theming.colorSystemText200;

	return StyleSheet.create({
		fab: {
			bottom: 120,
			height: 50,
			left: 20,
			padding: 10,
			position: 'relative',
			width: '90%',
			zIndex: 100,
		},
		fabButton: {
			backgroundColor: theming.colorLinesLonga,
			height: '100%',
		},
		fabButtonTitle: {
			color: fontColor,
		},
	});
};
