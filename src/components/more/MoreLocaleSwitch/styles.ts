/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flex: 1,
			flexDirection: 'row',
			gap: 10,
			height: 70,
			justifyContent: 'center',
			padding: 20,
		},
		buttonLabel: {
			color: systemVariables.text[100],
			fontSize: 16,
			fontWeight: '600',
		},
		container: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			marginBottom: 30,
			marginTop: 30,
			width: '100%',
		},
	});
};
