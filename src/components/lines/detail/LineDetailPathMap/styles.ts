/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flex: 1,
			height: 300,
			width: '100%',
		},
		loading: {
			alignItems: 'center',
			justifyContent: 'center',
		},
	});
};
