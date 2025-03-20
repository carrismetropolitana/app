/* * */

import { StyleSheet } from 'react-native';

/* CONTAINER */
export const favoriteToggleStyles = StyleSheet.create({
	container: {
		color: 'rgb(150, 150, 165)',
		cursor: 'pointer',
	// transition: all 200ms ease;
	},

	/* * */
	/* CONTAINER / DISABLED */
	disabled: {
		color: 'rgb(100 100 110)',
		transform: 'scale(1)',
	},
});
