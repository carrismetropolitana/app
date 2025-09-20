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
			height: '100%',
		},
		contentContainer: {
			backgroundColor: systemVariables.background[200],
			height: '100%',
		},
		listItem: {
			marginHorizontal: 20,
			marginTop: 20,
		},
	});

	//
};
