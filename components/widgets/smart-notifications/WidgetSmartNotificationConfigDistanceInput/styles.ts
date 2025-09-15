/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			borderBottomColor: useSystemVariables().border[100],
			borderBottomWidth: 1,
			borderTopColor: useSystemVariables().border[100],
			borderTopWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'center',
			padding: 15,
		},
		input: {
			borderColor: useSystemVariables().border[200],
			borderRadius: 8,
			borderWidth: 1,
			color: useSystemVariables().text[100],
			fontSize: 18,
			fontWeight: '600',
			justifyContent: 'center',
			padding: 15,
			textAlign: 'center',
			width: 100,
		},
		text: {
			color: useSystemVariables().text[200],
			fontSize: 16,
			fontWeight: '600',
			justifyContent: 'center',
			textAlign: 'center',
		},
	});
};
