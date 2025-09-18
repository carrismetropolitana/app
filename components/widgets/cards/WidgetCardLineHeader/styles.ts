/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			flexShrink: 1,
			gap: 10,
			justifyContent: 'flex-start',
			padding: 15,
		},
		title: {
			color: useSystemVariables().text[100],
			flexShrink: 1,
			fontSize: 16,
			fontWeight: 700,
		},
	});
};
