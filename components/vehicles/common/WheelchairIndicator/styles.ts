/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		bolt: {
			alignItems: 'center',
			aspectRatio: 1,
			backgroundColor: '#ffffff',
			borderColor: systemVariables.status.info,
			borderRadius: 999,
			borderWidth: 2,
			display: 'flex',
			justifyContent: 'center',
			marginLeft: -10,
			padding: 1,
		},
		container: {
			alignItems: 'center',
			borderRadius: 999,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			overflow: 'hidden',
		},
		disabled: {
			backgroundColor: systemVariables.background[200],
		},
		enabled: {
			backgroundColor: systemVariables.status.info,
		},
		main: {
			alignItems: 'center',
			aspectRatio: 1,
			borderRadius: 999,
			display: 'flex',
			justifyContent: 'center',
			padding: 7,
			paddingBottom: 10,
		},
		strike: {
			backgroundColor: 'red',
			height: 4,
			position: 'absolute',
			transform: [{ rotate: '-45deg' }],
			width: '100%',
		},
	});

	//
};
