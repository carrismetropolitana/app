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
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'column',
			flexShrink: 1,
			gap: 20,
			justifyContent: 'flex-start',
			padding: 20,
		},
		row: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 15,
			justifyContent: 'center',
			width: '100%',
		},
	});
};
