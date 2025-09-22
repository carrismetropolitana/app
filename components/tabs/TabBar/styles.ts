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
		container: {
			backgroundColor: systemVariables.background[100],
			borderTopColor: systemVariables.border[100],
			height: 55 + safeAreaInsets.bottom,
			paddingTop: 20,
		},
	});

	//
};
