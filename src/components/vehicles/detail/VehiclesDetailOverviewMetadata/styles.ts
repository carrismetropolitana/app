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
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 10,
			justifyContent: 'center',
		},
		makeAndModel: {
			color: systemVariables.text[200],
			fontSize: 14,
			fontWeight: 600,
			textAlign: 'center',
		},
	});
};
