/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
		},
		danger: {
			backgroundColor: systemVariables.status.danger,
		},
		info: {
			backgroundColor: systemVariables.status.info,
		},
		label: {
			color: '#ffffff',
			flexShrink: 1,
			fontSize: 16,
			fontWeight: 700,
			width: '100%',
		},
		ok: {
			backgroundColor: systemVariables.status.ok,
		},
		row: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'row',
			gap: 10,
			padding: 20,
		},
		title: {
			borderTopColor: 'rgba(255, 255, 255, 0.15)',
			borderTopWidth: 1,
			color: '#ffffff',
			flexShrink: 1,
			fontSize: 16,
			fontWeight: 500,
			lineHeight: 21,
			padding: 20,
		},
		warning: {
			backgroundColor: systemVariables.status.warning,
		},
	});
};
