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
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
			padding: 30,
		},
		message: {
			color: systemVariables.text[300],
			fontSize: 16,
			fontWeight: 600,
			textAlign: 'center',
		},
		thanks: {
			color: systemVariables.text[300],
			fontSize: 14,
			fontWeight: 600,
			marginTop: 15,
			textAlign: 'center',
		},
	});
};
