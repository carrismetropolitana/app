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
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 20,
			justifyContent: 'center',
			padding: 15,
		},
		input: {
			borderColor: systemVariables.border[200],
			borderRadius: 8,
			borderWidth: 1,
			color: systemVariables.text[100],
			fontSize: 18,
			fontWeight: '600',
			justifyContent: 'center',
			padding: 15,
			textAlign: 'center',
			width: 100,
		},
		text: {
			color: systemVariables.text[200],
			fontSize: 16,
			fontWeight: '600',
			justifyContent: 'center',
			textAlign: 'center',
		},
	});
};
