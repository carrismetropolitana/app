/* * */
import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';
/* * */

/* * */
const styles = () => {
	return StyleSheet.create({
		listTitle: {
			color: theming.colorSystemText200,
			fontSize: 16,
			fontWeight: theming.fontWeightSemibold as '600',
		},

		videoContainer: {
			marginBottom: 10,
		},
	});
};
export default styles;
