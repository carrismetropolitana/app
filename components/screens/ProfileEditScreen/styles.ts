/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */
const styles = () => {
	//

	//
	// A. Setup variables

	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight100
		: theming.colorSystemBackgroundDark100;
	const headerBackgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	//
	// B. Render Components
	// C. Return styles
	return StyleSheet.create({
		/* CONTAINER */

		container: {
			backgroundColor: backgroundColor,
			paddingBottom: 50,
		},

		/* * */
		/* SECTION WRAPPER */

		sectionWrapper: {
			backgroundColor: headerBackgroundColor,
			paddingBottom: 20,
			paddingTop: 10,
		},

		/* * */
		/* USER INFO SECTION */

		userSection: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			justifyContent: 'center',
			paddingBottom: 20,
			paddingTop: 36,
		},

		/* * */
		/* INPUTS / CHECKBOXES */

		checkbox: {
			backgroundColor: backgroundColor,
		},
		checkBoxText: {
			backgroundColor: backgroundColor,
			color: fontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightText as '500',
		},
		inputContainer: {
			backgroundColor: headerBackgroundColor,
		},
		inputLabel: {
			alignSelf: 'flex-start',
			backgroundColor: backgroundColor,
			color: fontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightBold as '700',
			paddingBottom: 10,
		},

		/* * */

	});

	//
};

export default styles;
