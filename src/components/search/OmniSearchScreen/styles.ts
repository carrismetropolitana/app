/* * */

import { useSystemVariables } from '@/theme/global';
import { StyleSheet } from 'react-native';

/* * */

export const useStyles = () => {
	//

	const systemVariables = useSystemVariables();

	return StyleSheet.create({
		emptyState: {
			alignItems: 'center',
			paddingTop: 40,
		},
		newsRow: {
			display: 'flex',
			flexDirection: 'row',
			gap: 15,
			paddingHorizontal: 15,
			paddingVertical: 5,
		},
		newsScrollView: {
			marginHorizontal: -15,
		},
		root: {
			backgroundColor: systemVariables.background[200],
			flex: 1,
		},
		scrollContent: {
			paddingBottom: 60,
		},
		searchBarWrapper: {
			backgroundColor: systemVariables.background[200],
			paddingBottom: 10,
			paddingHorizontal: 15,
		},
		section: {
			backgroundColor: systemVariables.background[100],
			borderTopColor: systemVariables.border[100],
			borderTopWidth: 1,
			marginTop: 15,
			overflow: 'hidden',
		},
		separator: {
			backgroundColor: systemVariables.border[100],
			height: 1,
			marginLeft: 20,
		},
	});
};
