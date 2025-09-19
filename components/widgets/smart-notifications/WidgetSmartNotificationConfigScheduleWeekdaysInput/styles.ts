/* * */

import { useSystemVariables } from '@/theme/global';
import { Dimensions, StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			backgroundColor: systemVariables.background[100],
			display: 'flex',
			flexDirection: 'column',
			gap: 10,
			justifyContent: 'center',
			padding: 15,
			width: '100%',
		},
		title: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 600,
		},
		weekday: {
			backgroundColor: systemVariables.background[100],
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: '600',
			paddingVertical: 10,
			textAlign: 'center',
			width: Math.ceil(Dimensions.get('screen').width / 7) - 5,
		},
		weekdaySelected: {
			backgroundColor: systemVariables.text[100],
			color: systemVariables.background[100],
		},
		weekdaysWrapper: {
			backgroundColor: systemVariables.border[100],
			borderColor: systemVariables.border[100],
			borderRadius: 5,
			borderWidth: 1,
			display: 'flex',
			flexDirection: 'row',
			gap: 1,
			justifyContent: 'flex-start',
			overflow: 'hidden',
			width: '100%',
		},
	});
};
