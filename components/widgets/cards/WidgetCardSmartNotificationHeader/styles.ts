/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
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
			borderColor: useSystemVariables().text[100],
			borderRadius: 3,
			borderWidth: 1,
			color: useSystemVariables().text[100],
			fontSize: 10,
			fontWeight: 800,
			marginBottom: 4,
			paddingHorizontal: 4,
			paddingVertical: 2,
			textTransform: 'uppercase',
		},
		locationName: {
			color: useSystemVariables().text[300],
			fontSize: 14,
			fontWeight: 600,
		},
		stopName: {
			color: useSystemVariables().text[100],
			fontSize: 14,
			fontWeight: 700,
		},
	});
};
