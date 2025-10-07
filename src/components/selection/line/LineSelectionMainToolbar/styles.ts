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
		row: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			padding: 15,
		},
		rowMapOverlay: {
			position: 'absolute',
			zIndex: 10,
		},
		toggle: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[100],
			borderRadius: 999,
			boxShadow: '0 0 15px 0 rgba(0,0,0,0.1)',
			display: 'flex',
			justifyContent: 'center',
			padding: 14,
		},
		withSafeArea: {
			paddingTop: safeAreaInsets.top,
		},
	});
};
