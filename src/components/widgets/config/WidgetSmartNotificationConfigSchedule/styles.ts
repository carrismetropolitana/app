/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.border[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 1,
			justifyContent: 'center',
			paddingVertical: 1,
		},
		error: {
			backgroundColor: systemVariables.background[100],
			color: systemVariables.status.danger,
			fontWeight: 600,
			padding: 15,
			textAlign: 'center',
			width: '100%',
		},
		title: {
			alignItems: 'center',
		},
		weekday: {
			alignItems: 'center',
		},
	});
};
