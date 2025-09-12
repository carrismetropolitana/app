/* * */

import { theming } from '@/theme/Variables';
import { Appearance, StyleSheet } from 'react-native';

/* * */

/* * */
export default StyleSheet.create({
	container: {
		backgroundColor: Appearance.getColorScheme() === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200,
		height: '100%',
	},
});
