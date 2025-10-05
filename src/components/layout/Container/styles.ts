/* * */

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const useStyles = () => {
	//

	const safeAreaInsets = useSafeAreaInsets();

	return StyleSheet.create({
		container: {
			// This is a hack to make the view full height
			// inside a ScrollView. Without it, the view
			// will only take the height of its content.
			borderBottomColor: 'transparent',
			borderBottomWidth: 1,
			//
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100%',
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
