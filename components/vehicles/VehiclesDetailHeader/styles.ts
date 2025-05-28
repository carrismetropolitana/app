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
			justifyContent: 'center',
			flexDirection: 'column',
			gap: 20,
		},
		headingSection: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			flexDirection: 'column',
			paddingTop: 16,
			justifyContent: 'center',
			alignContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
		busInfoSection: {
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'center',
			padding: 10,
		},
		accessibilitySection: {
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 10,
			width: '70%',
			alignItems: 'center',
			alignContent: 'center',
		},
		headingSectionRow: {
			padding: 20,
			gap: 15,
			width: '100%',
			justifyContent: 'space-around',
			alignItems: 'center',
		},
		lineName: {
			color: fontColor,
			fontSize: theming.fontSizeSubtitle,
			fontWeight: theming.fontWeightHeading as '700',
		},
		lineDestination: {
			color: theming.colorSystemText400,
			fontSize: theming.fontSizeMuted,
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
		tinyLogo: {
			height: 50,
			width: 50,
		},
		toolbarSection: {
			backgroundColor: theme.mode === 'light'
				? theming.colorSystemBackgroundLight100
				: theming.colorSystemBackgroundDark100,
			height: 125,
			marginBottom: 60,
		},
		occupancyFilled:{
			backgroundColor: theming.colorRealtime100,
			borderRadius: 999,
		},
		occupancyEmpty:{
			backgroundColor: theming.colorSystemBorder200,
			borderRadius: 999,
		}
	});

	//
};
