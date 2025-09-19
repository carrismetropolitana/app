/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			borderRadius: 999,
			fontSize: 18,
			fontWeight: '600',
			paddingHorizontal: 20,
			paddingVertical: 14,
			textAlign: 'center',
		},
		stateDisabled: {
			opacity: 0.1,
		},
		typeDanger: {
			backgroundColor: 'red',
			color: systemVariables.background[100],
		},
		typePrimary: {
			backgroundColor: systemVariables.text[100],
			color: systemVariables.background[100],
		},
		typeSecondary: {
			backgroundColor: systemVariables.text[400],
			color: systemVariables.text[200],
		},
	});
};
