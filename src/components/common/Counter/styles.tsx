/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const themeContext = useThemeContext();
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText300 : theming.colorSystemText400;
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		/* CONTAINER */
		text: {
			color: fontColor,
			fontSize: 12,
		},
		/* * */
		/* TEXT VARIANTS */
		textMuted: {
			color: theming.colorSystemText300,
		},
		textRealtime: {
			color: theming.colorRealtime100,
		},
		/* * */
		/* VEHICLE COUNTER WITH COUNT */
		vehiclesCounter: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			borderRadius: 999,
			bottom: 0,
			color: theming.colorRealtime100,
			flexDirection: 'row',
			fontSize: 10,
			fontWeight: '600',
			gap: 13,
			height: 32,
			marginBottom: 12,
			marginLeft: 10,
			minWidth: 50,
			paddingHorizontal: 16,
			paddingVertical: 4,
			position: 'absolute',

		},
		/* * */
		/* VEHICLE COUNTER EMPTY */
		zeroCount: {
			alignItems: 'center',
			alignSelf: 'flex-start',
			backgroundColor: backgroundColor,
			borderRadius: 999,
			bottom: 0,
			color: theming.colorSystemText400,
			flexDirection: 'row',
			fontSize: 10,
			fontWeight: '600',
			gap: 13,
			height: 32,
			justifyContent: 'center',
			left: 0,
			marginBottom: 12,
			marginLeft: 10,
			minWidth: 50,
			paddingHorizontal: 16,
			paddingVertical: 4,
			position: 'absolute',
		},
		/* * */

	});
};
