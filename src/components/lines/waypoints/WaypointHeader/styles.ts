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
			gap: 5,
		},
		divider: {
			color: systemVariables.text[300],
		},
		stopName: {
			color: systemVariables.text[100],
			fontSize: 16,
			fontWeight: 600,
		},
		subHeader: {
			color: systemVariables.text[200],
			fontSize: 13,
			fontWeight: 600,
		},
	});

	//
};
