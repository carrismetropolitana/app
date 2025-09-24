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
			gap: 6,
			justifyContent: 'center',
		},
		disabled: {
			backgroundColor: systemVariables.border[100],
		},
		enabled: {
			backgroundColor: systemVariables.status.ok,
		},
		full: {
			backgroundColor: systemVariables.status.warning,
		},
		indicator: {
			alignItems: 'center',
			borderRadius: 999,
			height: 22,
			width: 22,
		},
	});

	//
};
