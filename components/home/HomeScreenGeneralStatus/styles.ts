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
		},
		message: {
			backgroundColor: systemVariables.status.info,
			display: 'flex',
			flexDirection: 'column',
			paddingHorizontal: 20,
			paddingVertical: 15,
		},
		title: {
			color: '#ffffff',
			fontSize: 16,
			fontWeight: '600',
		},
	});
};
