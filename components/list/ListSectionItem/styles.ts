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
			gap: 20,
			padding: 20,
			paddingLeft: 20,
			width: '100%',
		},
		icon: {
			display: 'flex',
		},
		label: {
			color: systemVariables.text[100],
			fontSize: 18,
			fontWeight: 600,
		},
	});
};
