/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'stretch',
			backgroundColor: '#006EFF',
			borderRadius: 3,
			display: 'flex',
			flexDirection: 'row',
			gap: 2,
			justifyContent: 'center',
			padding: 2,
		},
		country: {
			color: '#ffffff',
			fontSize: 13,
			fontWeight: 700,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
		countryWrapper: {
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			paddingHorizontal: 4,
		},
		plate: {
			color: '#000000',
			fontSize: 13,
			fontWeight: 700,
			textAlign: 'center',
			textTransform: 'uppercase',
		},
		plateWrapper: {
			alignItems: 'center',
			backgroundColor: '#ffffff',
			borderBottomLeftRadius: 0,
			borderRadius: 2,
			borderTopLeftRadius: 0,
			display: 'flex',
			justifyContent: 'center',
			paddingHorizontal: 5,
			paddingVertical: 1,
		},
	});

	//
};
