/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;

	return StyleSheet.create({
		sm: {
			fontSize: 10,
			letterSpacing: 0.25,
			textTransform: 'uppercase',
		},
		strong: {
			color: fontColor,
			fontWeight: theming.fontWeightBold as 'bold',
		},
		text: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightText as 'normal',
			textAlign: 'left',
		},
	});
};
