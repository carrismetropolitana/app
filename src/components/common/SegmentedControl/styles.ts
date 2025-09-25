/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			borderColor: '#ccc',
			borderRadius: 5,
			borderWidth: 1,
			flexDirection: 'row',
			overflow: 'hidden',
			width: '100%',
		},
		icon: {
			borderRightColor: '#ccc',
			marginLeft: 0,
		},
		label: {
			color: 'black',
			fontSize: 16,
		},
		segment: {
			alignItems: 'center',
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'center',
			paddingVertical: 10,
		},
		segmentSelected: {
			backgroundColor: '#007AFF',
		},
	});
};
