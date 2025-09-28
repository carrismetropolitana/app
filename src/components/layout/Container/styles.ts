/* * */

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const safeAreaInsets = useSafeAreaInsets();

	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
		},
		safeBottom: {
			paddingBottom: safeAreaInsets.bottom,
		},
		safeTop: {
			paddingTop: safeAreaInsets.top,
		},
		scrollView: {
			height: '100%',
		},
	});
};
