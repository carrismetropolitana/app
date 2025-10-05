/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.background[200],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 15,
			minWidth: '100%',
			padding: 20,
			width: '100%',
		},
	});
};
