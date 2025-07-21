/* * */

import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		gradientCircle: {
			alignItems: 'center',
			borderRadius: 32,
			height: 40,
			justifyContent: 'center',

			width: 40,
		},
		innerCircle: {
			alignItems: 'center',
			backgroundColor: '#0C807E',
			borderRadius: 999,
			height: 35,
			justifyContent: 'center',
			width: 35,
		},
		notificationDot: {
			backgroundColor: '#0C807E',
			borderColor: '#fff',
			borderRadius: 5,
			borderWidth: 2,
			height: 10,
			position: 'absolute',
			right: 6,
			top: 6,
			width: 10,
		},
	});
};
