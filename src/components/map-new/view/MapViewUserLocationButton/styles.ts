/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			borderRadius: 999,
			boxShadow: '0 0 15px 0 rgba(0,0,0,0.1)',
			display: 'flex',
			justifyContent: 'center',
			padding: 14,
		},
	});
};
