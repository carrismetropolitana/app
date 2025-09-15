/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		button: {
			borderRadius: 999,
			fontSize: 18,
			fontWeight: '600',
			paddingHorizontal: 20,
			paddingVertical: 14,
			textAlign: 'center',
		},
		stateDisabled: {
			opacity: 0.1,
		},
		typeDanger: {
			backgroundColor: 'red',
			color: useSystemVariables().background[100],
		},
		typePrimary: {
			backgroundColor: useSystemVariables().text[100],
			color: useSystemVariables().background[100],
		},
		typeSecondary: {
			backgroundColor: useSystemVariables().text[400],
			color: useSystemVariables().text[200],
		},
	});
};
