/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		title: {
			color: useSystemVariables().text[200],
			fontSize: 16,
			fontWeight: 600,
			padding: 10,
			paddingLeft: 20,
		},
	});
};
