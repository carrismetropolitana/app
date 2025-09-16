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
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'space-between',
			padding: 15,
			width: '100%',
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
