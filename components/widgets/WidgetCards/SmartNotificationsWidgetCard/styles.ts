/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight100
		: theming.colorSystemBackgroundDark100;

	return StyleSheet.create({
		/* CARD + MODIFIERS */
		cardClosed: {
			borderRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
			marginBottom: 20,
		},
		cardOpen: {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			borderBottomWidth: 0,
			borderRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
		},
		/* * */
		/* CARD BODY */
		cardBody: {
			backgroundColor: backgroundColor,
			borderBottomLeftRadius: 10,
			borderBottomRightRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
			marginBottom: 20,
			overflow: 'hidden',
		},
		/* * */
		gradientCircle: {
			alignItems: 'center',
			borderRadius: 32,
			height: 40,
			justifyContent: 'center',
			top: -2,
			width: 40,
		},
		innerCircle: {
			alignItems: 'center',
			backgroundColor: '#0C807E',
			borderRadius: 999,
			height: 35,
			justifyContent: 'center',
			width: 35,
		},
		notificationDot: {
			backgroundColor: '#FFFFFF',
			borderColor: '#fff',
			borderRadius: 5,
			borderWidth: 2,
			height: 10,
			position: 'absolute',
			right: 6,
			top: 6,
			width: 10,
		},
	});
};
