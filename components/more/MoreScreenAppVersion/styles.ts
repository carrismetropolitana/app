/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		version: {
			color: useSystemVariables().text[300],
			fontSize: 12,
			fontWeight: 600,
			marginLeft: 20,
		},
	});
};
