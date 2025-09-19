/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			paddingBottom: 10,
			width: '100%',
		},
		itemsWrapper: {
			backgroundColor: systemVariables.border[100],
			borderBottomColor: systemVariables.border[100],
			borderBottomWidth: 1,
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
			gap: 1,
			width: '100%',
		},
	});
};
