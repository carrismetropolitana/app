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
			borderColor: systemVariables.status.info,
			borderRadius: 6,
			borderWidth: 2,
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			maxWidth: 300,
			padding: 15,
			width: '100%',
		},
		title: {
			color: systemVariables.status.info,
			fontSize: 14,
			fontWeight: 600,
		},
	});
};
