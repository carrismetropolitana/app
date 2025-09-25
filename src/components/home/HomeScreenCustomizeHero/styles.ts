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
			borderRadius: 30,
			display: 'flex',
			flexDirection: 'column',
			gap: 15,
			justifyContent: 'flex-start',
			padding: 30,
		},
		description: {
			color: systemVariables.text[200],
			fontSize: 14,
			fontWeight: 600,
			textAlign: 'center',
		},
		image: {
			maxHeight: 150,
			maxWidth: '100%',
		},
		title: {
			color: systemVariables.text[100],
			fontSize: 20,
			fontWeight: 700,
			textAlign: 'center',
		},
	});
};
