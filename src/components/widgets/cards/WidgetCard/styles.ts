/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.background[100],
			borderRadius: 10,
			boxShadow: '0 0 15px 0 rgba(0,0,0,0.1)',
			overflow: 'hidden',
		},
		containerIsDragging: {
			transform: [{ scale: 1.05 }],
		},
		headerWrapper: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'space-between',
			width: '100%',
		},
		headerWrapperIsOpen: {
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
		},
	});
};
