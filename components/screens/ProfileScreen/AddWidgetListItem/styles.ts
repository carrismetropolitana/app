/* * */

import { theming } from '@/theme/Variables';
import { StyleSheet } from 'react-native';

/* * */

/* * */
const styles = () => {
	return StyleSheet.create({
		listTitle: {
			fontSize: theming.fontSizeNav,
			fontWeight: theming.fontWeightNav as '600',
		},
	});
};
export default styles;
