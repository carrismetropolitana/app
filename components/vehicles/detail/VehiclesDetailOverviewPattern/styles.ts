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
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
			width: '100%',
		},
		headsign: {
			color: systemVariables.text[100],
			fontSize: 20,
			fontWeight: 700,
			textAlign: 'center',
			width: '100%',
		},
	});
};
