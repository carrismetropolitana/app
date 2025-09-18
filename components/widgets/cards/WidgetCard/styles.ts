/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			backgroundColor: useSystemVariables().background[100],
			borderRadius: 10,
			boxShadow: '0 0 15px 0px rgba(0,0,0,0.1)',
			overflow: 'hidden',
		},
		containerIsDragging: {
			transform: [{ scale: 1.05 }],
		},
		headerWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: '100%',
		},
		headerWrapperIsOpen: {
			borderBottomColor: useSystemVariables().border[100],
			borderBottomWidth: 1,
		},
	});
};
