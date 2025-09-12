/* * */

import { Dimensions, StyleSheet } from 'react-native';

/* * */

export default StyleSheet.create({
	container: {
		shadowColor: '#000',
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: 0.05,
		shadowRadius: 5,
	},
	image: {
		aspectRatio: '16/9',
		borderRadius: 12,
		resizeMode: 'cover',
		width: Dimensions.get('window').width - 70,
	},
});
