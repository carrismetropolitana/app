/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundLight100
		: theming.colorSystemBackgroundDark100;
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
			backgroundColor: backgroundColor,
			flexDirection: 'row',
			gap: 10,
			width: '100%',
		},
		/* * */
		/* HEADING DETAILS CONTAINER */

		headerDetailsContainer: {
			alignItems: 'flex-start',
			flexDirection: 'row',
			gap: 10,
			width: '100%',
		},

		/* * */
		/* NAME WRAPPER */

		nameWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: '70%',
		},

		/* * */
		/* Actions Wrapper */

		actionsWrapper: {
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'flex-end',
			paddingRight: 10,
			width: '30%',
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
		/* FACILITIES WRAPPER */

		facilitiesWrapper: {
			flexDirection: 'row',
			gap: 10,
			width: '100%',
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
