/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		text: {
			color: systemVariables.text[300],
			fontSize: 16,
			fontWeight: 'bold',
			letterSpacing: 1,
			padding: 20,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
	});
};
