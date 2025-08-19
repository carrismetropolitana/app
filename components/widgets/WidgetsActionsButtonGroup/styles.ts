/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundDark300
		: theming.colorSystemBackgroundDark300;
	const fontColor = isLight
		? theming.colorSystemText900
		: theming.colorSystemText300;

	return StyleSheet.create({
		container: {
			paddingHorizontal: 20,
		},
		/* SAVE BUTTON */
		saveButton: {
			backgroundColor: backgroundColor,
			borderRadius: 30,
			borderWidth: 0,
			height: 51,
			marginBottom: 20,
			width: '100%',
		},
		/* * */
		/* SAVE BUTTON TEXT */
		saveButtonText: {
			borderWidth: 0,
			color: fontColor,
			fontSize: 16,
			fontWeight: '600',
		},
		/* * */
	});
};
