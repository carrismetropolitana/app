/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: 2,
			padding: 20,
			paddingBottom: 10,
		},
		subtitle: {
			color: useSystemVariables().text[300],
			fontSize: 14,
			fontWeight: 500,
		},
		title: {
			color: useSystemVariables().text[200],
			fontSize: 16,
			fontWeight: 600,
		},
	});
};
