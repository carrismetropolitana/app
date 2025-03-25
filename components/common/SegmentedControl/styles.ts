import { StyleSheet } from 'react-native';

export const segmentedControlStyles = StyleSheet.create({
	centerSection: {
		alignItems: 'center',
		justifyContent: 'center',

	},
	label: {
		color: 'black',
		fontSize: 16,
	},
	leftSection: {
		borderRightColor: '#ccc',
		marginLeft: 0,
	},
	rightSection: {
		marginLeft: 0,
	},
	segment: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 10,
	},
	segmentedControl: {

		borderColor: '#ccc',
		borderRadius: 20,
		borderWidth: 1,
		flexDirection: 'row',
		overflow: 'hidden',
		width: '100%',
	},
	selectedSegment: {
		backgroundColor: '#007AFF',
	},
});
