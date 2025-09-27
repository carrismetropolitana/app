/* * */

import { useSystemVariables } from '@/theme/global';
import { Platform, StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

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
			paddingBottom: Platform.OS === 'ios' ? 68 : 100,
			paddingTop: 20,
		},
		item: {
			minHeight: 45,
		},
	});

	//
};
