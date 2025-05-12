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
	});
};
