/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			paddingBottom: 30,
			paddingTop: 30,
		},
	});
};
