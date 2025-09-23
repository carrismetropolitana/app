/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();
	const safeAreaInsets = useSafeAreaInsets();

	return StyleSheet.create({
		content: {
			backgroundColor: systemVariables.background[200],
			paddingBottom: safeAreaInsets.bottom,
		},
		header: {
			alignItems: 'flex-end',
			backgroundColor: systemVariables.background[100],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			padding: 5,
		},
	});
};
