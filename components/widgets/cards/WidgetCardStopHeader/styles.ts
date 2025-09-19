/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			flexShrink: 1,
			gap: 4,
			justifyContent: 'center',
			padding: 15,
		},
		label: {
			borderColor: systemVariables.text[100],
			borderRadius: 3,
			borderWidth: 1,
			color: systemVariables.text[100],
			fontSize: 10,
			fontWeight: 800,
			marginBottom: 4,
			paddingHorizontal: 4,
			paddingVertical: 2,
			textTransform: 'uppercase',
		},
		locationName: {
			color: systemVariables.text[300],
			fontSize: 14,
			fontWeight: 600,
		},
		stopName: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 700,
		},
	});
};
