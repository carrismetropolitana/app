/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'flex-start',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			justifyContent: 'flex-start',
			paddingHorizontal: 15,
			paddingVertical: 20,
			width: '100%',
		},
		description: {
			color: systemVariables.text[200],
			fontSize: 14,
			fontWeight: 600,
			marginLeft: 5,
		},
		input: {
			backgroundColor: systemVariables.background[300],
			borderRadius: 8,
			color: systemVariables.text[100],
			fontSize: 18,
			fontWeight: 600,
			marginTop: 5,
			padding: 10,
			width: '100%',
		},
		label: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 700,
			marginLeft: 5,
			textTransform: 'uppercase',
		},
		withBorderBottom: {
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
		},
		withBorderTop: {
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
		},
	});
};
