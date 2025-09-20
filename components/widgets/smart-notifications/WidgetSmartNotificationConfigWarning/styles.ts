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
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
			padding: 20,
		},
		disclaimer: {
			color: systemVariables.text[300],
			fontSize: 12,
			fontWeight: '500',
		},
		summary: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: '500',
		},
		title: {
			color: systemVariables.text[200],
			fontSize: 14,
			fontWeight: '700',
			textAlign: 'center',
			textTransform: 'uppercase',
			width: '100%',
		},
	});
};
