/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		actionsWrapper: {
			alignItems: 'flex-start',
			flexDirection: 'row',
			gap: 8,
		},
		container: {
			alignItems: 'flex-start',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			justifyContent: 'flex-start',
			padding: 20,
		},
		detailsWrapper: {
			flexDirection: 'column',
			flexShrink: 1,
			gap: 10,
			paddingTop: 5,
			width: '100%',
		},
		facilitiesWrapper: {
			flexDirection: 'row',
			gap: 10,
			width: '100%',
		},
		location: {
			color: systemVariables.text[300],
			fontSize: 20,
			fontWeight: 600,
		},
		metadata: {
			color: systemVariables.text[200],
			fontSize: 14,
			fontWeight: 600,
		},
		name: {
			color: systemVariables.text[100],
			fontSize: 22,
			fontWeight: 700,
		},
		row: {
			alignItems: 'flex-start',
			display: 'flex',
			flexDirection: 'row',
			gap: 15,
			justifyContent: 'flex-start',
			width: '100%',
		},
	});
};
