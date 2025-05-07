/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorPrimaryBlack
		: theming.colorSystemText300;

	return StyleSheet.create({
		/* * */
		/* SECTION WRAPPER */

		sectionWrapper: {
			backgroundColor: backgroundColor,
			paddingTop: theming.sizeSpacing15,
			width: '100%',
		},
		/* * */
		/* SECTION HEADING */

		sectionHeading: {

			color: fontColor,
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightNav as '600',
			marginTop: 20,
			paddingBottom: 15,
			paddingLeft: 15,
		},

		/* * */
		/* UPCOMING CIRCULATIONS */

		upcomingCirculationsDescription: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightText as '500',
			marginTop: 20,
			paddingLeft: 15,
		},

		/* * */
		/* ARRIVAL TIME */
		arrival: {
			fontSize: 16,
		},

		/* * */
		/* ARRIVAL CONTAINER */
		arrivalContainer: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 5,
			width: '100%',
		},

		/* * */
		/* ARRIVAL CONTAINER */
		headsign: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightHeading as '700',
			paddingLeft: 10,
			paddingRight: 10,
		},

	});
};
