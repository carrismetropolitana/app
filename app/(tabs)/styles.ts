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
		iconWrapper: {
			alignItems: 'center',
			color: systemVariables.text[300],
			display: 'flex',
			height: 45,
			justifyContent: 'center',
			width: 45,
		},
		iconWrapperIsFocused: {
			backgroundColor: systemVariables.brand.cm,
			borderRadius: 999,
		},
		tabBar: {
			backgroundColor: systemVariables.background[100],
			borderTopColor: systemVariables.border[100],
			height: 55 + safeAreaInsets.bottom,
			paddingTop: 20,
		},
	});

	//
};
