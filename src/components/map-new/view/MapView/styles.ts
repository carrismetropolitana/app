/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			flex: 1,
		},
		userLocationButtonWrapper: {
			bottom: 15,
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
