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
     	arrow: {
		color: '#3D85C6',
		fontSize: 20,
		marginRight: 6,
	},
	backButton: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	backText: {
		color: '#3D85C6',
		fontSize: 16,
		fontWeight: '500',
	},
	container: {
		flex: 1,
		height: '100%',
		marginTop: 30,
		maxWidth: '100%',
		minWidth: '100%',

	},
	sectionWrapper:{
		marginBottom: 20,
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 16,
	},
	userSection: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 36,
	},
	userTypeText: {
		color: '#3D85C6',
		fontSize: 14,
		fontWeight: '700',
	},
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
    });

    //
};
