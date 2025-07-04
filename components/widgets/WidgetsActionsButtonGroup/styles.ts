/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

const styles = () => {
	return StyleSheet.create({
		/* SAVE BUTTON */
		saveButton: {
			backgroundColor: theming.colorBrand,
			borderRadius: 30,
			borderWidth: 0,
			marginBottom: 20,
			width: '100%',
		},
		/* * */
		/* SAVE BUTTON TEXT */
		saveButtonText: {
			borderWidth: 0,
			color: '#000000',
			fontSize: 16,
			fontWeight: '600',
		},
		/* * */
	});
};
export default styles;
