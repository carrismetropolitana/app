/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight ? theming.colorSystemText200 : theming.colorSystemText400;
	const backgroundColor = theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const shadowColor = theme.mode === 'light' ? theming.colorSystemBackgroundDark200 : theming.colorSystemBackgroundLight200;

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
		headerEmoji: {
			fontSize: 32,
			marginBottom: 8,
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
		wrapper: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			borderRadius: 16,
			elevation: 2,
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			padding: 32,
			shadowColor: shadowColor,
			shadowOffset: { height: 2, width: 0 },
			shadowOpacity: 0.04,
			shadowRadius: 8,
		},
	});
};
