/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			color: systemVariables.status.danger,
			fontSize: 16,
			fontWeight: '600',
			textAlign: 'center',
		},
		container: {
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			marginTop: 20,
			padding: 20,
			width: '100%',
		},
	});
};
