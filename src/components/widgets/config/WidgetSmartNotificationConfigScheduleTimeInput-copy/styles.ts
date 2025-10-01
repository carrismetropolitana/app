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
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'space-between',
			padding: 15,
			width: '100%',
		},
		text: {
			color: systemVariables.text[200],
			fontSize: 17,
			fontWeight: '600',
			justifyContent: 'center',
		},
	});
};
