/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		container: {
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
		},
		splashImage: {
			aspectRatio: 1,
			height: '100%',
			resizeMode: 'cover',
		},
	});
};
