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
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'row',
			gap: 5,
			padding: 20,
			paddingRight: 15,
			width: '100%',
		},
		containerDisabled: {
			opacity: 0.25,
		},
		contentWrapper: {
			display: 'flex',
			flexDirection: 'column',
			flexShrink: 1,
			gap: 2,
			width: '100%',
		},
		description: {
			color: systemVariables.text[200],
			fontSize: 12,
			fontWeight: 600,
		},
		icon: {
			display: 'flex',
			paddingRight: 15,
		},
		label: {
			color: systemVariables.text[100],
			flexShrink: 1,
		},
		labelMd: {
			fontSize: 18,
			fontWeight: 600,
		},
		labelSm: {
			fontSize: 14,
			fontWeight: 700,
		},
	});
};
