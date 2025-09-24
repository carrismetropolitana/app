/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		buttonContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			padding: 15,
			paddingTop: 50,
		},
		text: {
			color: systemVariables.text[200],
			fontSize: 16,
			fontWeight: '600',
			justifyContent: 'center',
			marginBottom: 10,
			textAlign: 'center',
		},
	});
};
