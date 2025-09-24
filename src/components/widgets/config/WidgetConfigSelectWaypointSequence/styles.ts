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
			backgroundColor: systemVariables.background[300],
			borderColor: systemVariables.text[400],
			borderRadius: 999,
			borderWidth: 3,
			display: 'flex',
			height: 32,
			justifyContent: 'center',
			width: 32,
		},
		text: {
			color: systemVariables.text[300],
			fontSize: 16,
			fontWeight: '700',
		},
	});
};
