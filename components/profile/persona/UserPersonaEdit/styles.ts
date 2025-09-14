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
			height: '100%',
			justifyContent: 'center',
			padding: 5,
			width: 60,
		},
		container: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().border[100],
			borderColor: useSystemVariables().border[100],
			borderRadius: 999,
			borderWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 1,
			height: 45,
			marginTop: -35,
			overflow: 'hidden',
		},
	});
};
