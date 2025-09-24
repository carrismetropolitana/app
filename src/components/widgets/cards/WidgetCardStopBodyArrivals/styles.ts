/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.border[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 1,
			justifyContent: 'flex-start',
		},
		loadingContainer: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			justifyContent: 'center',
			padding: 30,
		},
		noDataContainer: {
			backgroundColor: systemVariables.background[100],
		},
	});
};
