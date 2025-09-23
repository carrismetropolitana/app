/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		border: {
			backgroundColor: systemVariables.border[100],
			height: 1,
			width: '100%',
		},
		contentContainer: {
			paddingBottom: 50,
		},
		title: {
			backgroundColor: 'red',
		},
	});
};
