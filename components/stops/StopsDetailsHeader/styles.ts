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
		/* CONTAINER */

		container: {
			alignItems: 'flex-start',
			flexDirection: 'column',
			gap: 10,
			justifyContent: 'flex-start',
		},

		/* * */
		/* BADGES WRAPPER */

		badgesWrapper: {
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-start',
			marginTop: 10,
		},

		/* * */
		/* HEADING WRAPPER */

		headingWrapper: {
			alignItems: 'flex-start',
			backgroundColor: '#FFFFFF',
			gap: 10,
			width: '100%',
		},
		/* * */
		/* NAME WRAPPER */

		nameWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 10,
			justifyContent: 'space-between',
			width: '100%',
		},

		/* * */
		/* HEADING SECTION / ROW */

		headingSectionRow: {
			alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'flex-start',
		},
		/* * */
		/* ICONS WRAPPER */

		iconsDivider: {
			backgroundColor: '#E0E0E0',
			height: 20,
			minWidth: 2,
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
			paddingBottom: 15,
			paddingLeft: 15,
		},

		/* * */
		/* SECTION WRAPPER */

		sectionWrapper: {
			paddingBottom: theming.sizeSpacing15,
			paddingTop: theming.sizeSpacing15,
			width: '100%',
		},

		/* * */
		/* LINE WRAPPER */
		lineWrapper: {
			gap: 10,
			paddingLeft: 15,
		},
		/* * */
		/* LINE ITEM */
		lineItem: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 10,
			width: '100%',

		},
	});
};
