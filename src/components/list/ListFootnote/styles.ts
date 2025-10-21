/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
			gap: 2,
			padding: 20,
			paddingTop: 10,
		},
		text: {
			color: systemVariables.text[300],
			fontSize: 14,
			fontWeight: 500,
		},
	});
};
