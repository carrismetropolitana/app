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
			padding: 20,
		},
		description: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: '500',
			marginBottom: 8,
		},
		title: {
			color: systemVariables.text[100],
			fontSize: 26,
			fontWeight: '700',
			marginBottom: 8,

		},
	});
};
