/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			padding: 15,
			width: '100%',
		},
		input: {
			color: systemVariables.text[100],
			flexShrink: 1,
			fontSize: 24,
			fontWeight: '500',
			width: '100%',
		},
		inputWrapper: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			borderRadius: 999,
			boxShadow: '0 0 15px 0 rgba(0,0,0,0.1)',
			color: systemVariables.text[400],
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			padding: 15,
		},
	});
};
