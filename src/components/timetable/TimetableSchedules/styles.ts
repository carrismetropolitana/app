/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		column: {
			display: 'flex',
			flexDirection: 'column',
			gap: 4,
		},
		container: {
			alignItems: 'flex-start',
			flexDirection: 'row',
			flexWrap: 'wrap',
			rowGap: 15,
		},
		hourBase: {
			backgroundColor: systemVariables.text[100],
			color: systemVariables.background[100],
			fontSize: 14,
			fontWeight: 700,
			paddingHorizontal: 4,
			paddingVertical: 5,
			textAlign: 'center',
		},
		hourFirst: {
			borderBottomLeftRadius: 999,
			borderTopLeftRadius: 999,
			paddingLeft: 15,
		},
		hourLast: {
			borderBottomRightRadius: 999,
			borderTopRightRadius: 999,
			paddingRight: 15,
		},
		minuteBase: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 500,
			paddingHorizontal: 0,
			textAlign: 'right',
		},
	});

	//
};
