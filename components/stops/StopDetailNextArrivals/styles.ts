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
		? theming.colorSystemText200
		: theming.colorSystemText300;

	return StyleSheet.create({
		/* * */
		/* SECTION WRAPPER */

		sectionWrapper: {
			backgroundColor: 'transparent',
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
			color: theming.colorStatusOkText,
			fontSize: 16,
			fontWeight: theming.fontWeightTitle as '600',
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
			maxWidth: '50%',
			paddingLeft: 10,
			paddingRight: 10,
		},

		/* * */
		/* SEE MORE */

		see_more: {
			alignContent: 'center',
			alignItems: 'center',
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightText as '500',
			paddingVertical: 10,
			textAlign: 'center',
			width: '100%',
		},

		/* * */
		/* DOT / RIPPLE */
		dot: {
			backgroundColor: theming.colorStatusOkText,
			borderRadius: 5,
			height: 6,
			width: 6,
		},
		ripple: {
			alignItems: 'center',
			backgroundColor: theming.colorStatusOkBackground,
			borderRadius: 999,
			height: 25,
			justifyContent: 'center',
			marginRight: 5,
			width: 25,
		},

		rippleContainer: {
			alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'flex-end',
		},
	});
};
