/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		toggle: {
			color: useSystemVariables().text[300],
			fontWeight: 600,
			marginBottom: 100,
			padding: 15,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
	});
};
