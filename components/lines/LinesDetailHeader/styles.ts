/* * */

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
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;
	//
	// B. Render Components

	return StyleSheet.create({
		headingFirstSection: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 20,
		},
		headingSection: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			height: 125,
		},
		headingSectionRow: {
			gap: 15,
		},
		lineName: {
			color: fontColor,
			fontSize: theming.fontSizeSubtitle,
			fontWeight: theming.fontWeightHeading as '700',
		},
		mapSection: {
			height: 200,
			width: '100%',
		},
		operationalDaySection: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			padding: 10,
			width: '100%',
		},
		patternGroupSection: {
			backgroundColor: backgroundColor,
		},
		toolbarSection: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			height: 125,
			marginBottom: 60,
		},
	});

	//
};
