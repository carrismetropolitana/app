/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText200
		: theming.colorSystemText400;

	return StyleSheet.create({
		container: {
			color: fontColor,
			flex: 1,
			flexDirection: 'row',
			opacity: 0.15,
			textTransform: 'uppercase',
		},
		fill: {
			height: '100%',
			justifyContent: 'center',
			textAlign: 'center',
			width: '100%',
		},
		text: {
			color: fontColor,
			fontSize: 20,
			fontWeight: 'bold',
			letterSpacing: 1,
			textAlign: 'center',
		},
		withMinHeight: {
			padding: 30,
		},
	});
};
