import { StyleSheet } from 'react-native';

export const lineDisplayStyles = StyleSheet.create({
	/* CONTAINER */
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'flex-start',
		left: 10,
		right: 10,
		width: '80%',
	},
	/* * */
	/* Skeleton */
	skeleton: {
		backgroundColor: '#eee',
		borderRadius: 9999,
		height: 24,
		width: '100%',
	},
});
