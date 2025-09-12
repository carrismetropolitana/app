/* * */

import { theming } from '@/theme/Variables';
import { Appearance, StyleSheet } from 'react-native';

/* * */

export const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		borderBottomColor: 'rgb(230 230 250)',
		borderBottomWidth: 1,
		display: 'flex',
		flexDirection: 'row',
		gap: 20,
		padding: 15,
		paddingLeft: 20,
		width: '100%',
	},
	icon: {
		display: 'flex',
	},
	label: {
		color: Appearance.getColorScheme() === 'light' ? theming.colorSystemText100 : theming.colorSystemText100,
		fontSize: 18,
		fontWeight: 600,
	},
});
