import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	arrow: {
		color: '#3D85C6',
		fontSize: 20,
		marginRight: 6,
	},
	backButton: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	backText: {
		color: '#3D85C6',
		fontSize: 16,
		fontWeight: '500',
	},
	container: {
		flex: 1,
		height: '100%',
		marginTop: 30,
		maxWidth: '100%',
		minWidth: '100%',

	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 16,
	},
	userSection: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 36,
	},
	userTypeText: {
		color: '#3D85C6',
		fontSize: 14,
		fontWeight: '700',
	},
});

export default styles;
