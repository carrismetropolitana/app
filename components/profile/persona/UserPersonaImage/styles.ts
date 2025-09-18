/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		background: {
			height: '100%',
			opacity: 0.5,
			position: 'absolute',
			width: '100%',
		},
		container: {
			backgroundColor: useSystemVariables().background[100],
			borderRadius: 999,
			overflow: 'hidden',
		},
	});
};
