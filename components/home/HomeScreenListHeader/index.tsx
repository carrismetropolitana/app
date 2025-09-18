/* * */

import { HomeScreenTopBar } from '@/components/home/HomeScreenTopBar';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenListHeader() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<HomeScreenTopBar />
		</View>
	);

	//
}
