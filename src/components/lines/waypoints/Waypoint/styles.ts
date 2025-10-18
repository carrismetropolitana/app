/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		container: {
			alignItems: 'flex-start',
			flex: 1,
			flexDirection: 'row',
			gap: 10,
			justifyContent: 'flex-start',
			paddingLeft: 15,
			paddingRight: 20,
		},
		containerIsFirstStop: {
			paddingTop: 20,
		},
		containerIsLastStop: {
			paddingBottom: 20,
		},
		containerIsSelected: {
			backgroundColor: systemVariables.background[100],
			boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.05)',
			elevation: 5,
			zIndex: 5,
		},
		details: {
			display: 'flex',
			flexDirection: 'column',
			gap: 15,
			paddingBottom: 30,
			paddingTop: 18,
		},
		detailsIsFirstStop: {
			paddingTop: 0,
		},
		detailsIsLastStop: {
			paddingBottom: 0,
		},
	});

	//
};
