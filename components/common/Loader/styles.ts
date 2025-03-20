/* * */
/* SPINNER */

import { StyleSheet } from 'react-native';

const conatiner = {
	alignItems: 'center',
	backgroundColor: 'rgb(40,40,50)',
	display: 'flex',
	height: '100%',
	justifyContent: 'center',
	left: 0,
	top: 0,
	width: '100%',
	zIndex: 9999,
} as const;

export const loaderStyles = StyleSheet.create({

	/* * */
	/* OPTIONS */
	fixed: {
		...conatiner,
		position: 'fixed',
	},
	full: {
		...conatiner,
		position: 'absolute',
	},

	maxed: {
		...conatiner,
		position: 'static',
	},
	/* * */
	spinner: {
		borderColor: 'rgb(30, 30 ,40)',
		borderRadius: 999,
		borderStyle: 'solid',
		borderTopColor: 'rgb(80,80,85)',
		// animation: spin 1s linear infinite;
	},
	/* * */
	/* ANIMATION */

	// @keyframes spin {
	//   0% {
	//     transform: rotate(0deg);
	//   }
	//   100% {
	//     transform: rotate(360deg);
	//   }
	// }
});
