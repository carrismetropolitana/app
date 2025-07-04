/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

const styles = StyleSheet.create({

	/* * */
	/* CONTAINER */

	container: {
		gap: 50,
		maxWidth: 900,
	},

	/* * */
	/* SECTION */

	section: {
		gap: theming.sizeSpacing10,
	},

	/* * */
	/* TITLE */

	title: {
		fontSize: 18,
		fontWeight: '600',
	},

	/* * */
	/* TEXT */

	text: {
		fontSize: 15,
		fontWeight: '500',
	},

	/* * */
	/* AUTHORIZATION OPTIONS */

	authorizationOptions: {
		alignItems: 'flex-start',
		gap: theming.sizeSpacing10,
	},
});

export default styles;
