/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { useSystemVariables } from '@/theme/global';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();
	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	return StyleSheet.create({
		arrivalsWrapper: {
			display: 'flex',
			flexDirection: 'row',
			gap: 20,
		},
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
		},
		realtimeArrival: {
			color: systemVariables.status.live,
			fontSize: 16,
			fontWeight: 600,
		},
		realtimeArrivalsList: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'flex-start',
		},
		realtimeArrivalsWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-start',
		},
		scheduledArrival: {
			color: systemVariables.text[100],
			fontSize: 16,
			fontWeight: 600,
		},
		scheduledArrivalsList: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'flex-start',
		},
		scheduledArrivalsWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-start',
		},
		title: {
			color: fontColor,
			fontSize: 12,
			fontStyle: 'italic',
			fontWeight: 500,
		},
	});
};
