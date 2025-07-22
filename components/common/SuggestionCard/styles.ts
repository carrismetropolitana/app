/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	const themeContext = useThemeContext();

	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText200 : theming.colorSystemText300;
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const shadowColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundDark200 : theming.colorSystemBackgroundLight200;

	return StyleSheet.create({
		description: {
			color: '#666',
			fontSize: 15,
			marginTop: 8,
			textAlign: 'center',
		},
		headerEmoji: {
			fontSize: 32,
			marginBottom: 8,
		},
		text: {
			color: fontColor,
		},
		title: {
			color: '#333',
			fontSize: 18,
			fontWeight: '600',
		},
		wrapper: {
			alignItems: 'center',
			backgroundColor: backgroundColor,
			borderRadius: 16,
			elevation: 2,
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			padding: 32,
			shadowColor: shadowColor,
			shadowOffset: { height: 2, width: 0 },
			shadowOpacity: 0.04,
			shadowRadius: 8,
		},
	});
};
export default styles;
