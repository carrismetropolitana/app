import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	//

	//
	// A. Setup variables

	const { theme } = useThemeContext();
	const isLight = theme.mode === 'light';
	const backgroundColor = isLight
		? theming.colorSystemBackgroundDark300
		: theming.colorSystemBorderDark200;
	const hourFontColor = isLight
		? theming.colorPrimaryWhite
		: theming.colorSystemText300;
	const fontColor = isLight
		? theming.colorSystemText200
		: theming.colorSystemText300;
	//
	// B. Render Components

	return StyleSheet.create({
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
		dynamicHourPillBase: {
			backgroundColor: backgroundColor,
			color: hourFontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightExtrabold as '800',
			lineHeight: 16,
			marginBottom: 2,
			textAlign: 'center',
		},
		dynamicHourPillLast: {
			borderBottomRightRadius: 8,
			borderTopRightRadius: 8,
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
			backgroundColor: backgroundColor,
			borderRadius: 999,
			color: hourFontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightExtrabold as '800',
			lineHeight: 16,
			marginBottom: 2,
			paddingHorizontal: 6,
			textAlign: 'center',
		},
		hourPill: {
			backgroundColor: backgroundColor,
			borderBottomLeftRadius: 8,
			borderTopLeftRadius: 8,
			color: hourFontColor,
			fontSize: 14,
			fontWeight: theming.fontWeightExtrabold as '800',
			lineHeight: 16,
			marginBottom: 2,
			paddingHorizontal: 6,
			textAlign: 'center',
		},
		minute: {
			borderRadius: 999,
			color: fontColor,
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
			color: fontColor,
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

	//
};
