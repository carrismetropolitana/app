/* * */

import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	return StyleSheet.create({
		buttonContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: 20,
			padding: 15,
			paddingTop: 50,
		},
	});
};
