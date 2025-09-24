import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		gap: theming.sizeSpacing10,
	},
	exception: {
		color: theming.colorSystemText300,
		fontSize: 14,
		fontWeight: theming.fontWeightMedium as '500',
	},
	exceptionId: {
		fontWeight: theming.fontWeightBold as '700',
	},
	exceptionIsSelected: {
		color: theming.colorStatusInfoText,
	},
	icon: {
		height: 14,
		marginLeft: 2,
		width: 14,
	},
	patternHeadsign: {
		fontWeight: theming.fontWeightSemibold as '600',
		textDecorationLine: 'underline',
	},
});
