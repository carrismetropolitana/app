import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		/* * */
		/* CONTAINER */
		container: {
			alignItems: 'center',
			backgroundColor: '#006EFF',
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
