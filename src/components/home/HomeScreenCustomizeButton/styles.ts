/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			backgroundColor: systemVariables.text[100],
			borderRadius: 999,
			color: systemVariables.background[100],
			flexDirection: 'row',
			fontSize: 12,
			fontWeight: '700',
			paddingHorizontal: 20,
			paddingVertical: 10,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
		container: {
			alignItems: 'center',
			display: 'flex',
		},
	});

	//
};
