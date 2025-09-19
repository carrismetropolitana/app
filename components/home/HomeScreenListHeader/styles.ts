/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const insets = useSafeAreaInsets();
	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.background[100],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			display: 'flex',
			flexDirection: 'column',
			paddingTop: Math.max(insets.top, 20),
		},
	});
};
