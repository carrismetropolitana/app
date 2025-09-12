/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		button: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			display: 'flex',
			flex: 1,
			flexDirection: 'row',
			gap: 10,
			height: 70,
			justifyContent: 'center',
			padding: 20,
		},
		buttonLabel: {
			color: useSystemVariables().text[100],
			fontSize: 16,
			fontWeight: '600',
		},
		container: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			marginBottom: 30,
			marginTop: 30,
			width: '100%',
		},
	});
};
