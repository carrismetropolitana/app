import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	column: {
		alignItems: 'stretch',
		flexDirection: 'column',
		minWidth: 50,
	},
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: theming.sizeSpacing15,
	},
	exception: {
		fontSize: 10,
		fontWeight: theming.fontWeightBold as '700',
		marginLeft: 4,
		position: 'absolute',
		right: -1,
		top: 0,
	},
	hour: {
		backgroundColor: theming.colorPrimaryBlack,
		borderRadius: 999,
		color: theming.colorPrimaryWhite,
		fontSize: 14,
		fontWeight: theming.fontWeightExtrabold as '800',
		lineHeight: 16,
		marginBottom: 2,
		paddingHorizontal: 6,
		textAlign: 'center',
	},
	minute: {
		borderRadius: 999,
		fontSize: 14,
		fontWeight: theming.fontWeightSemibold as '600',
		lineHeight: 16,
		marginBottom: 2,
		paddingHorizontal: 6,
		textAlign: 'center',
	},
	minuteIsHighlighted: {
		backgroundColor: theming.colorBrand,
		borderRadius: 100,
		color: theming.colorSystemText100,
		margin: 2,
	},
	minuteIsOthersSelected: {
		color: theming.colorSystemText400,
	},
	minuteIsSelected: {
		color: theming.colorStatusInfoText,
	},
	minuteWithException: {
		color: theming.colorSystemText300,
		fontWeight: theming.fontWeightMedium as '500',
		position: 'relative',
	},
});
