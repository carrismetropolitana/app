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
        ? theming.colorSystemBackgroundLight100
        : theming.colorSystemBackgroundDark100;
    const fontColor = isLight
        ? theming.colorSystemText100
        : theming.colorSystemText300;

    //
    // B. Render Components

    return StyleSheet.create({
	/* CONTAINER */

	container: {
		flex: 1,
		height: '100%',
		marginTop: 30,
		maxWidth: '100%',
		minWidth: '100%',
	},

	/* * */
	/* SECTION WRAPPER */

	sectionWrapper:{
		marginBottom: 20,
	},

	/* * */
	/* USER INFO SECTION */

	userSection: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 36,
	},

	/* * */
	/* INPUTS / CHECKBOXES */

	inputLabel: {
		color: fontColor,
		fontSize: 14,
		fontWeight: theming.fontWeightBold as '700',
		alignSelf: 'flex-start',
		paddingBottom: 10,
	},
	checkbox:{
		backgroundColor: backgroundColor,
	},
	checkBoxText:{
		color: fontColor,
		fontSize: 14,
		fontWeight: theming.fontWeightText as '500',
	}
	
	/* * */

    });

    //
};
