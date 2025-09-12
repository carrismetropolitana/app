/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export default StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: '#ffffff',
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		padding: 5,
		width: 60,
	},
	container: {
		alignItems: 'center',
		backgroundColor: theming.colorSystemBorder200,
		borderColor: theming.colorSystemBorder200,
		borderRadius: 999,
		borderWidth: 1,
		display: 'flex',
		flexDirection: 'row',
		gap: 1,
		height: 45,
		marginTop: -35,
		overflow: 'hidden',
	},
});
