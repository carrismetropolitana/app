import { StyleSheet } from 'react-native';

export const lineDetailsHeaderStyles = StyleSheet.create({
	container: {
		alignItems: 'center',
		gap: 10,
		justifyContent: 'center',
		width: '100%',
	},
	headingSection: {
		gap: 15,
		justifyContent: 'flex-start',
	},
	headingSectionRow: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 15,
		justifyContent: 'center',
	},
	lineName: {
		alignItems: 'center',
		color: 'rgb(255, 255, 255)',
		fontSize: 20,
		fontWeight: 700,
		justifyContent: 'flex-start',
		overflow: 'hidden',
		width: '100%',
	},
});
