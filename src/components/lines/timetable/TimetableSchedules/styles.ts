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
			gap: 7,
		},
		container: {
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
			width: '100%',
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
			fontWeight: 700,
			paddingHorizontal: 4,
			textAlign: 'center',
		},
		minuteContainer: {
			paddingHorizontal: 4,
			position: 'relative',
		},
		minuteContainerIsSelected: {
			paddingHorizontal: 4,
			position: 'relative',
		},
		minuteException: {
			color: systemVariables.text[300],
			fontWeight: 500,
		},
		minuteExceptionIndex: {
			color: systemVariables.text[300],
			fontSize: 10,
			fontWeight: 500,
			marginLeft: 4,
			position: 'absolute',
			right: -1,
			top: 0,
		},
		minuteLast: {
			borderBottomRightRadius: 999,
			borderTopRightRadius: 999,
			paddingRight: 15,
		},
	});

	//
};
