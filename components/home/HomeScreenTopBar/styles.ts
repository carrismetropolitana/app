/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: useSystemVariables().background[100],
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingRight: 20,
		},
		logo: {
			height: 70,
			width: 150,
		},
	});
};
