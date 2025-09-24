import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		color: theming.colorSystemText300,
		fontSize: 14,
		fontWeight: theming.fontWeightMedium as 'medium',
	},
	containerIsOthersSelected: {
		color: theming.colorSystemText400,
	},
	containerIsSelected: {
		color: theming.colorStatusInfoText,
	},
	exceptionId: {
		fontWeight: theming.fontWeightBold as 'bold',
	},
	icon: {
		height: 14,
		marginLeft: 2,
		width: 14,
	},
	patternHeadsign: {
		fontWeight: theming.fontWeightSemibold as 'semibold',
		textDecorationLine: 'underline',
	},
	routeLongName: {
		fontWeight: theming.fontWeightSemibold as 'semibold',
	},
});
