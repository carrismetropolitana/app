/* * */

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	const insets = useSafeAreaInsets();

	return StyleSheet.create({
		container: {
			flex: 1,
		},
		userLocationButtonWrapper: {
			bottom: insets.bottom + 64,
			display: 'flex',
			position: 'absolute',
			right: 15,
			zIndex: 10,
		},
		vehiclesCounterWrapper: {
			bottom: 15,
			display: 'flex',
			left: 15,
			position: 'absolute',
			zIndex: 10,
		},
	});
};
