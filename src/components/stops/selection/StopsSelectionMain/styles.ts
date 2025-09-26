/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		hidden: {
			bottom: 0,
			left: 0,
			opacity: 0,
			pointerEvents: 'none',
			position: 'absolute',
			right: 0,
			top: 0,
		},
		visible: {
			opacity: 1,
			pointerEvents: 'auto',
			position: 'static',
		},
	});
};
