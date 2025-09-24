/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		accountIdentifier: {
			color: systemVariables.text[400],
			fontSize: 12,
			fontWeight: 600,
			textAlign: 'center',
		},
		container: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			padding: 20,
		},
	});
};
