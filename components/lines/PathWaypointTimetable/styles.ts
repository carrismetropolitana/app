import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Setup variables

	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	//
	// B. Render Components

	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: theming.sizeSpacing5,
		},
		nextDate: {
			color: theming.colorStatusInfoText,
			fontSize: 14,
			fontStyle: 'italic',
			fontWeight: theming.fontWeightMedium as '500',
			textDecorationLine: 'underline',
		},
		noData: {
			color: fontColor,
			fontSize: 14,
			fontStyle: 'italic',
			fontWeight: theming.fontWeightMedium as '500',
		},
		title: {
			color: fontColor,
			fontSize: 12,
			fontStyle: 'italic',
			fontWeight: theming.fontWeightMedium as '500',
		},
	})
};