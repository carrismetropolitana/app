/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			height: '100%',
			justifyContent: 'center',
			padding: 5,
			width: 60,
		},
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.border[100],
			borderColor: systemVariables.border[100],
			borderRadius: 999,
			borderWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 1,
			height: 45,
			marginTop: -35,
			overflow: 'hidden',
		},
	});
};
