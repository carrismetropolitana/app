/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		header: {
			alignItems: 'flex-end',
			backgroundColor: useSystemVariables().background[100],
			borderBottomColor: useSystemVariables().border[100],
			borderBottomWidth: 1,
			display: 'flex',
			padding: 5,
		},
		safeArea: {
			backgroundColor: useSystemVariables().background[200],
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
		},
	});
};
