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
			backgroundColor: systemVariables.background[200],
			flex: 1,
			justifyContent: 'center',
			padding: 20,
		},
		link: {
			color: systemVariables.text[100],
			marginTop: 15,
			paddingVertical: 15,
		},
	});
};
