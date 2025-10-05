/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		alert: {
			alignItems: 'center',
			borderRadius: 999,
			borderWidth: 2,
			display: 'flex',
			justifyContent: 'center',
			position: 'absolute',
		},
		alertSizeLg: {
			height: 30,
			right: -12,
			top: -12,
			width: 30,
		},
		alertSizeMd: {
			height: 26,
			right: -10,
			top: -10,
			width: 26,
		},
		alertSizeSm: {
			height: 20,
			right: -9,
			top: -9,
			width: 20,
		},
		container: {
			alignItems: 'center',
			borderRadius: 999,
			display: 'flex',
			justifyContent: 'center',
			padding: 3,
		},
		containerSizeLg: {
			height: 38,
			width: 95,
		},
		containerSizeMd: {
			height: 30,
			width: 75,
		},
		containerSizeSm: {
			height: 24,
			width: 54,
		},
		label: {
			fontWeight: '800',
			textAlign: 'center',
		},
		labelSizeLg: {
			fontSize: 24,
		},
		labelSizeMd: {
			fontSize: 18,
		},
		labelSizeSm: {
			fontSize: 14,
		},
	});
};
