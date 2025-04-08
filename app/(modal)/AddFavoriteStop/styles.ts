import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '70%',
		maxWidth: '100%',
		minWidth: '100%',
	},
	deleteButton: {
		backgroundColor: theming.colorBrand,
		borderRadius: 30,
		color: '#fffff',
	},
	saveButton: {
		backgroundColor: theming.colorBrand,
		borderRadius: 30,
		color: '#fffff',
	},
});

export default styles;
