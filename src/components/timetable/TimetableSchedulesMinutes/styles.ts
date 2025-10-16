/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		exception: {
			fontSize: 10,
			fontWeight: '700',
			marginLeft: 4,
			position: 'absolute',
			right: -1,
			top: 0,
		},
		minute: {
			borderRadius: 999,
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: '600',
			lineHeight: 16,
			marginBottom: 2,
			paddingHorizontal: 6,
			textAlign: 'center',
		},
		minuteIsHighlighted: {
			backgroundColor: systemVariables.brand.cm,
			borderRadius: 100,
			color: systemVariables.text[100],
			margin: 2,
		},
		minuteIsOthersSelected: {
			color: systemVariables.text[100],
		},
		minuteIsSelected: {
			color: systemVariables.text[100],
		},
		minuteWithException: {
			color: systemVariables.text[300],
			fontWeight: '500',
			position: 'relative',
		},
	});

	//
};
