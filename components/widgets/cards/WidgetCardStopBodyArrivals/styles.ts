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
	});
};
