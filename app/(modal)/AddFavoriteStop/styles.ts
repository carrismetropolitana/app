import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		marginTop: 20,
		maxWidth: '100%',
		minWidth: '100%',
	},
	deleteButton: {
		backgroundColor: theming.colorAlerts3,
		borderRadius: 30,
		color: '#FFFFFF',
	},
	deleteButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
	listTitle: {
		color: theming.colorSystemText200,
		fontSize: 16,
		fontWeight: '600',
	},
	saveButton: {
		backgroundColor: theming.colorBrand,
		borderRadius: 30,
		borderWidth: 0,
		marginBottom: 30,
		width: '100%',
	},
	saveButtonText: {
		borderWidth: 0,
		color: '#000000',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default styles;
