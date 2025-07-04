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
		? theming.colorSystemText100
		: theming.colorSystemText300;

	/* * */
	/* CONTAINER */

	const container = {
		display: 'flex',
		flexDirection: 'column',
		gap: theming.sizeSpacing5,
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
		/* TITLE */

		title: {
			color: fontColor,
			fontSize: 12,
			fontStyle: 'italic',
			fontWeight: theming.fontWeightMedium as 'medium',
		},

		/* * */
		/* ARRIVALS WRAPPER */

		arrivalsWrapper: {
			display: 'flex',
			flexDirection: 'row',
			gap: theming.sizeSpacing20,
		},

		realtimeArrivalsList: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: theming.sizeSpacing10,
			justifyContent: 'flex-start',
		},

		realtimeArrivalsWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: theming.sizeSpacing5,
			justifyContent: 'flex-start',
		},

		scheduledArrivalsList: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: theming.sizeSpacing10,
			justifyContent: 'flex-start',
		},
		scheduledArrivalsWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: theming.sizeSpacing5,
			justifyContent: 'flex-start',
		},

		/* * */
		/* REALTIME ARRIVAL */

		realtimeArrival: {
			color: theming.colorRealtime100,
			fontSize: 16,
			fontWeight: theming.fontWeightBold as 'semibold',
		},

		/* * */
		/* SCHEDULED ARRIVAL */

		scheduledArrival: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as 'semibold',
		},

	});

	//
};
