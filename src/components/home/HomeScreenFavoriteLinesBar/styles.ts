/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			padding: 20,
			width: '100%',
		},
	});
};
