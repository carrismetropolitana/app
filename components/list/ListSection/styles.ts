/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			paddingBottom: 10,
			paddingTop: 10,
			width: '100%',
		},
		itemsWrapper: {
			backgroundColor: useSystemVariables().border[100],
			borderBottomColor: useSystemVariables().border[100],
			borderBottomWidth: 1,
			borderTopColor: useSystemVariables().border[100],
			borderTopWidth: 1,
			gap: 1,
			width: '100%',
		},
	});
};
