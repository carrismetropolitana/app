/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: 2,
			padding: 20,
			paddingBottom: 10,
		},
		description: {
			color: systemVariables.text[300],
			fontSize: 14,
			fontWeight: 500,
		},
		title: {
			color: systemVariables.text[200],
			fontSize: 16,
			fontWeight: 600,
		},
	});
};
