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
		columnVertical: {
			alignItems: 'center',
			flexDirection: 'row',
			gap: 5,
		},
		container: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			paddingRight: 5,
			rowGap: 15,
		},
		containerVertical: {
			flexDirection: 'column',
			justifyContent: 'center',
			rowGap: 0,
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
			paddingRight: 10,
		},
		hourVertical: {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			borderTopLeftRadius: 0,
			borderTopRightRadius: 0,
			minWidth: 60,
			paddingLeft: 0,
			paddingRight: 0,
			textAlign: 'center',
		},
		minuteBase: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 700,
			paddingHorizontal: 2,
			textAlign: 'center',
		},
		minuteContainer: {
			paddingHorizontal: 4,
			position: 'relative',
		},
		minuteContainerIsSelected: {
			alignItems: 'center',
			backgroundColor: systemVariables.brand.cm,
			borderRadius: 999,
			height: 28,
			justifyContent: 'center',
			paddingHorizontal: 0,
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
		minuteExceptionIsSelected: {
			color: systemVariables.text[100],
		},
		minuteIsSelected: {
			color: systemVariables.text[400],
		},
		minuteLast: {
			borderBottomRightRadius: 999,
			borderTopRightRadius: 999,
			paddingRight: 10,
		},
	});

	//
};
