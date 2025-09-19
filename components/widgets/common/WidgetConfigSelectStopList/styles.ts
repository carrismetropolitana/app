/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		header: {
			alignItems: 'flex-end',
			backgroundColor: systemVariables.background[100],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			padding: 5,
		},
		safeArea: {
			backgroundColor: systemVariables.background[200],
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
		},
	});
};
