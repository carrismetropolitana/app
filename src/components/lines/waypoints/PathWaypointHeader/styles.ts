/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			paddingHorizontal: 15,
		},
		facilitiesWrapper: {
			flex: 1,
			flexDirection: 'row',
			gap: 10,
			marginTop: 5,
		},
		isFirstStop: {
			// paddingTop: 20,
		},
		isLastStop: {
			paddingBottom: 20,
		},
		stopId: {
			color: systemVariables.text[100],
			fontSize: 14,
			fontWeight: 600,
			marginLeft: 10,
		},
		stopIdCopyIcon: {
			color: 'transparent',
			height: 11,
			marginBottom: 2,
			marginLeft: 3,
			width: 11,
		},
		stopLocation: {
			color: systemVariables.text[100],
			fontSize: 16,
			fontWeight: 600,
			paddingTop: 11,
		},
		stopName: {
			color: systemVariables.text[100],
			flex: 1,
			flexDirection: 'row',
			fontSize: 15,
			fontWeight: 600,
			gap: 5,
			justifyContent: 'space-between',
			maxWidth: 400,
		},
		stopNameUrl: {
			alignItems: 'center',
			color: systemVariables.text[100],
			flex: 1,
			justifyContent: 'center',
		},
		subHeaderWrapper: {
			alignItems: 'center',
			flexDirection: 'row',
			marginBottom: 10,
		},
	});

	//
};
