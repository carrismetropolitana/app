/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();
	const insets = useSafeAreaInsets();

	return StyleSheet.create({
		contentContainer: {
			minHeight: '100%',
			paddingBottom: insets.bottom + 24,
		},
		contentContainerEmpty: {
			flexGrow: 1,
		},
		listItem: {
			marginHorizontal: 20,
			marginTop: 20,
		},
		listWrapper: {
			flex: 1,
			minHeight: 0,
		},
		loading: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[200],
			flex: 1,
			justifyContent: 'center',
		},
		screen: {
			backgroundColor: systemVariables.background[100],
			flex: 1,
		},
	});

	//
};
