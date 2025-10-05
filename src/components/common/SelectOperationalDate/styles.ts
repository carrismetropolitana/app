/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		button: {
			alignItems: 'center',
			borderRadius: 5,
			boxShadow: '0 0 5 0 rgba(0, 0, 0, 0.1)',
			display: 'flex',
			flexDirection: 'row',
			flexShrink: 1,
			gap: 5,
			height: '100%',
			justifyContent: 'center',
			padding: 15,
			width: '100%',
		},
		buttonIsSelected: {
			backgroundColor: systemVariables.background[100],
			boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.08)',
		},
		container: {
			alignItems: 'center',
			backgroundColor: systemVariables.background[300],
			borderRadius: 8,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			padding: 5,
			width: '100%',
		},
		label: {
			color: systemVariables.text[200],
			fontSize: 16,
			fontWeight: '500',
			textAlign: 'center',
		},
		labelIsSelected: {
			color: systemVariables.text[100],
			fontWeight: '600',
		},
	});
};
