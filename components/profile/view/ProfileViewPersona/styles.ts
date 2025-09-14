/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		activity: {
			fontSize: 14,
			fontWeight: '700',
			textTransform: 'uppercase',
		},
		button: {
			backgroundColor: useSystemVariables().background[200],
			borderRadius: 999,
			flexDirection: 'row',
		},
		buttonContainer: {
			backgroundColor: useSystemVariables().background[100],
			marginTop: 15,
		},
		buttonTitle: {
			color: useSystemVariables().text[100],
			fontSize: 14,
			fontWeight: '600',
		},
		container: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			paddingBottom: 30,
			paddingTop: 30,
		},
		displayName: {
			color: useSystemVariables().text[100],
			fontSize: 28,
			fontWeight: '700',
			marginTop: 10,
		},
	});
};
