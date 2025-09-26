/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		activity: {
			fontSize: 14,
			fontWeight: '700',
			textTransform: 'uppercase',
		},
		button: {
			backgroundColor: systemVariables.background[200],
			borderRadius: 999,
			color: systemVariables.text[200],
			flexDirection: 'row',
			fontSize: 12,
			fontWeight: '700',
			marginTop: 15,
			paddingHorizontal: 20,
			paddingVertical: 10,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 5,
			paddingBottom: 30,
			paddingTop: 30,
		},
		displayName: {
			color: systemVariables.text[100],
			fontSize: 28,
			fontWeight: '700',
			marginTop: 10,
		},
	});
};
