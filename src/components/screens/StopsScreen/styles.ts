/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;
	const fontColor = isLight ? theming.colorSystemText100 : theming.colorSystemText300;
	const labelColor = isLight ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		/* NEXT ARRIVALS CONTAINER */
		nextArrivalsContainer: {
			top: 30,
		},
		/* * */
		/* NEXT ARRIVALS LABEL */
		nextArrivalsLabel: {
			bottom: 10,
			color: labelColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightTitle as '600',
			marginLeft: 10,
			marginTop: 10,
		},
		/* * */
		/* CONTAINER */

		container: {
			backgroundColor: backgroundColor,
			flex: 1,
			height: '100%',
			width: '100%',
		},

		/* * */
		/* CONTENT CONTAINER */

		contentContainer: {
			flex: 1,
		},

		/* * */
		/* CONTAINER */

		stopHeader: {
			backgroundColor: backgroundColor,
			flexDirection: 'row',
		},

		/* * */
		/* STOPNAME */

		stopName: {
			color: fontColor,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightHeading as 'bold',
		},

		/* * */
		/* METADATA */

		metaData: {
			color: theming.colorSystemText300,
			fontSize: theming.fontSizeMuted,
			fontWeight: theming.fontWeightTitle as '600',
		},

	});
};
