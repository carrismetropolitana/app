/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		version: {
			color: systemVariables.text[300],
			fontSize: 12,
			fontWeight: 600,
			marginLeft: 20,
		},
	});
};
