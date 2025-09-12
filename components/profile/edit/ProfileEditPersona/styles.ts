/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export default StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: theming.colorSystemBackgroundLight100,
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
		paddingBottom: 30,
		paddingTop: 30,
	},
});
