/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		activityIndicator: {
			position: 'absolute',
			zIndex: 999,
		},
		background: {
			height: '100%',
			opacity: 0.5,
			position: 'absolute',
			width: '100%',
		},
		container: {
			alignItems: 'center',
			borderColor: 'transparent',
			borderRadius: 999,
			display: 'flex',
			justifyContent: 'center',
			overflow: 'hidden',
		},
	});
};
