/* * */

import { StyleSheet } from 'react-native';

/* * */

/* * */
const styles = () => {
	return StyleSheet.create({
		container: {
			borderColor: '#E0E0E0',
			borderRadius: 8,
			borderWidth: 1,
			overflow: 'hidden',
		},
		grip: {
			marginRight: 12,
			padding: 8,
		},
		inner: {
			alignItems: 'center',
			flexDirection: 'row',
			padding: 12,
		},
		wrapper: {
			// paddingHorizontal: 8,
			// paddingVertical: 4,
			width: '100%',
		},
	});
};
export default styles;
