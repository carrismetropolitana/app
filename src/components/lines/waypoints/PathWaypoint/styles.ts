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
		detailsWrapper: {
			flex: 1,
			flexDirection: 'column',
			gap: 15,
			paddingBottom: 15,
			paddingTop: 20,
		},
		isFirstStop: {
			paddingTop: 20,
		},
		isLastStop: {
			paddingBottom: 20,
		},
		isSelected: {
			backgroundColor: systemVariables.background[100],
			boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.05)',
		},
	});

	//
};
