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
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			padding: 20,
		},
		title: {
			color: systemVariables.text[200],
			fontWeight: 700,
		},
	});
};
