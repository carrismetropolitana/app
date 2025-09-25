/* * */

import { StyleSheet, useWindowDimensions } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const windowDimensions = useWindowDimensions();

	return StyleSheet.create({
		container: {
			height: windowDimensions.height / 2,
			width: '100%',
		},
	});
};
