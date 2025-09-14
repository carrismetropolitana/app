/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			backgroundColor: useSystemVariables().background[100],
			padding: 20,
		},
		description: {
			color: useSystemVariables().text[100],
			fontSize: 14,
			fontWeight: '500',
			marginBottom: 8,
		},
		title: {
			color: useSystemVariables().text[100],
			fontSize: 26,
			fontWeight: '700',
			marginBottom: 8,

		},
	});
};
