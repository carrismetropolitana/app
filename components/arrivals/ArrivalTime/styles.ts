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
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-start',
		},
		title: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 700,
		},
	});
};
