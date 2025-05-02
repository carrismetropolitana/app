import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: theming.sizeSpacing5,
	},
	nextDate: {
		color: theming.colorStatusInfoText,
		fontSize: 14,
		fontStyle: 'italic',
		fontWeight: theming.fontWeightMedium as '500',
		textDecorationLine: 'underline',
	},
	noData: {
		color: theming.colorSystemText300,
		fontSize: 14,
		fontStyle: 'italic',
		fontWeight: theming.fontWeightMedium as '500',
	},
	title: {
		color: theming.colorSystemText300,
		fontSize: 12,
		fontStyle: 'italic',
		fontWeight: theming.fontWeightMedium as '500',
	},
});
