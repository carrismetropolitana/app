/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const safeAreaInsets = useSafeAreaInsets();
	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingRight: 20,
			paddingTop: Math.max(safeAreaInsets.top, 20),
		},
		logo: {
			height: 70,
			width: 150,
		},
	});
};
