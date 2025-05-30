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
		? theming.colorSystemText200
		: theming.colorSystemText300;
	const headerfontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText400;

	/* * */
	/* CONTAINER */

	const container = {
		flex: 1,
		flexDirection: 'column',
	} as const;

	//
	// B. Render Components

	return StyleSheet.create({
		/* * */
		/* CONTAINER */

		container: {
			...container,
		},

		/* * */
		/* STOP NAME */

		stopName: {
			color: headerfontColor,
			flex: 1,
			flexDirection: 'row',
			fontSize: 15,
			fontWeight: theming.fontWeightBold as 'bold',
			gap: theming.sizeSpacing5,
			justifyContent: 'space-between',
			maxWidth: 400,
		},
		stopNameUrl: {
			alignItems: 'center',
			color: fontColor,
			flex: 1,
			justifyContent: 'center',
		},

		/* * */
		/* SUB-HEADER WRAPPER */

		subHeaderWrapper: {
			alignItems: 'baseline',
			flexDirection: 'row',
		},

		/* * */
		/* STOP LOCATION */

		stopLocation: {
			color: fontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightSemibold as '600',
		},

		/* * */
		/* STOP ID */

		stopId: {
			color: fontColor,
			fontSize: 12,
			fontWeight: theming.fontWeightBold as '600',
			marginLeft: theming.sizeSpacing10,
		},

		stopIdCopyIcon: {
			color: 'transparent',
			height: 11,
			marginBottom: 2,
			marginLeft: 3,
			width: 11,
		},

		/* * */
		/* FACILITIES WRAPPER */

		facilitiesWrapper: {
			flex: 1,
			flexDirection: 'row',
			gap: theming.sizeSpacing10,
			marginTop: theming.sizeSpacing5,
		},

		/* * */
		/* STOPS LIST ITEM */

		isCopied: {
			color: theming.colorRealtime100,
		},
		isFirstStop: {
			paddingTop: theming.sizeSpacing20,
		},
		isLastStop: {
			paddingBottom: theming.sizeSpacing20,
		},
		isSelected: {
			backgroundColor,

		},
	});

	//
};
