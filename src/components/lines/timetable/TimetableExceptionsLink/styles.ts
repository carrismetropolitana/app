/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		id: {
			fontWeight: 700,
		},
		text: {
			color: systemVariables.text[300],
			fontSize: 14,
			fontWeight: 500,
			lineHeight: 20,
		},
		value: {
			fontWeight: 600,
		},
	});
};
