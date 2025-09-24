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
		button: {
			alignItems: 'center',
			color: systemVariables.text[300],
			display: 'flex',
			height: 45,
			justifyContent: 'center',
			width: 45,
		},
		buttonIsFocused: {
			backgroundColor: systemVariables.brand.cm,
			borderRadius: 999,
		},
		container: {
			backgroundColor: systemVariables.background[100],
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
			paddingBottom: 32 + safeAreaInsets.bottom,
			paddingTop: 20,
		},
	});

	//
};
