/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'center',
			color: systemVariables.text[300],
			display: 'flex',
			height: 45,
			justifyContent: 'center',
			width: 45,
		},
		containerIsFocused: {
			backgroundColor: systemVariables.brand.cm,
			borderRadius: 999,
		},
	});
};
