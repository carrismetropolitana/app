/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			backgroundColor: useSystemVariables().background[100],
			borderBottomColor: useSystemVariables().border[100],
			borderBottomWidth: 1,
			display: 'flex',
			flexDirection: 'column',
		},
	});
};
