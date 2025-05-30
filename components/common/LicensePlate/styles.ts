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
		? theming.colorSystemBackgroundLight200
		: theming.colorSystemBackgroundDark200;
	const fontColor = isLight
		? theming.colorSystemText100
		: theming.colorSystemText300;

	//
	// B. Render Components

	return StyleSheet.create({
		/* * */
		/* CONTAINER */
		container: {
			alignItems: 'center',
			backgroundColor: 'rgb(15 70 210)',
			borderRadius: 4,
			flexDirection: 'row',
			gap: 2,
			justifyContent: 'center',
			padding: 2,
		},
		/* * */
		/* COUNTRY */
		countryContainer: {
			paddingLeft: 2,
			paddingRight: 2,
		},
		countryText: {
			color: '#ffffff',
			fontSize: 11,
			fontWeight: theming.fontWeightBold as 'bold',
			textAlign: 'center',
			textTransform: 'uppercase',
		},
		/* * */
		/* PLATE */
		plateContainer: {
			backgroundColor: '#ffffff',
			borderRadius: 2,
			paddingLeft: 10,
			paddingRight: 5,
		},
		plateText: {
			color: '#000000',
			fontSize: 14,
			fontWeight: theming.fontWeightBold as 'bold',
			textTransform: 'uppercase',
		},
	});

	//
};
