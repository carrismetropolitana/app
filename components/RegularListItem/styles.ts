/* * */
import { StyleSheet } from 'react-native';
/* * */

export const styles = StyleSheet.create({
	/* * */
	/* CONTAINER */
	container: {
		alignItems: 'center',
		backgroundColor: '#fff',
		color: '#000',
		display: 'flex',
		flexDirection: 'row',
		gap: 2,
		justifyContent: 'flex-start',
		paddingRight: 20,
		paddingTop: 15,
		width: '100%',
	},
	/* * */
	/* DISABLE LINK  */
	disableLink: {
		pointerEvents: 'none',
	},
	/* * */
	/* ICON WRAPPER  */
	iconWrapper: {
		display: 'flex',
	},
	/* * */
	/* CHILDREN WRAPPER */
	childrenWrapper: {
		width: '100%',
	},
	/* * */
	/* ARROW WRAPPER */
	arrowWrapper: {
		color: 'd2d2dc',
		display: 'flex',
	},
});
