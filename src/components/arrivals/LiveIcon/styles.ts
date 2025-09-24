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
			height: 20,
			justifyContent: 'center',
			position: 'relative',
			width: 20,
		},
		dot: {
			backgroundColor: systemVariables.status.live,
			borderRadius: 999,
			height: 4,
			width: 4,
		},
		ripple: {
			backgroundColor: systemVariables.status.live,
			borderRadius: 999,
			height: 20,
			position: 'absolute',
			width: 20,
		},
	});
};
