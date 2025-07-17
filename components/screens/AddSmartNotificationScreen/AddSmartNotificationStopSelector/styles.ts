/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;

	return StyleSheet.create({
		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},

		muted: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},
		showLess: {
			color: fontColor,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
			marginTop: 10,
			textAlign: 'center',
		},
		showMore: {
			alignItems: 'center',
			color: fontColor,
			fontSize: 18,
			fontWeight: theming.fontWeightSemibold as '600',
			paddingBottom: 10,
			paddingTop: 10,
			textAlign: 'center',
			width: '100%',
		},
		text: {
			alignItems: 'center',
			color: fontColor,
			fontSize: 18,
			fontWeight: theming.fontWeightSemibold as '600',
			paddingBottom: 10,
			paddingTop: 10,
			textAlign: 'center',
			width: '100%',
		},
	});
};
export default styles;
