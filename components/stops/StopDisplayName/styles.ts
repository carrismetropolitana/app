import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

const name = {
	fontWeight: theming.fontWeightBold.toString() as 'bold',
};
export const styles = StyleSheet.create({
	/* * */
	/* NAME */

	lg: {
		...name,
		fontSize: 20,
	},
	md: {
		...name,
		fontSize: 16,
	},

	/* * */
});
