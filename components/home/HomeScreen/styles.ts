/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		activeContainer: {
			borderColor: 'red',
			transform: [{ scale: 1.1 }],
		},
		container: {
			backgroundColor: useSystemVariables().background[100],
		},
		container2: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			borderColor: 'black',
			borderWidth: 1,
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			padding: 50,
		},
		list: {
			backgroundColor: useSystemVariables().background[100],
		},
	});
};
