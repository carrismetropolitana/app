/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
		},
		safeArea: {
			backgroundColor: useSystemVariables().background[200],
			height: '100%',
		},
	});
};
