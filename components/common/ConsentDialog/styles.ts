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
		/* LOGO */
		logo: {
			alignSelf: 'center',
			height: 75,
			width: 150,
		},
		/* * */
		/* OVERRIDES */

		contentOverride: {
			backgroundColor: backgroundColor,
			borderRadius: theming.borderRadiusLg,
		},

		/* * */
		/* TEXT & TITLE */

		link: {
			alignSelf: 'center',
			color: fontColor,
			fontSize: 12,
			fontWeight: 500,
			paddingTop: 10,
			textAlign: 'center',
		},

		text: {
			color: fontColor,
			fontSize: 14,
			fontWeight: 500,
			textAlign: 'center',
		},

		title: {
			fontSize: 18,
			fontWeight: 700,
			marginBottom: theming.sizeSpacing15,
			textAlign: 'center',
		},

		/* * */
		/* ANSWERS WRAPPER */

		answersWrapper: {
			alignItems: 'center',
			gap: theming.sizeSpacing15,
			justifyContent: 'center',
			marginTop: theming.sizeSpacing15,
			width: '100%',
		},

		/* * */
		/* REFUSE BUTTON */

		refuseButtonOverride: {
			opacity: 1,
		},

		/* * */
		/* ACCEPT BUTTON */

		acceptButtonOverride: {
			backgroundColor: theming.colorBrand,
			height: 50,
			width: 100,
		},
	});

	//
};
