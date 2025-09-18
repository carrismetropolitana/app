/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			backgroundColor: useSystemVariables().background[100],
		},
		contentContainer: {
			backgroundColor: useSystemVariables().background[200],
		},
		listItem: {
			marginHorizontal: 20,
			marginTop: 20,
		},
	});
};
