/* * */

import { HomeScreenCustomizeHero } from '@/components/home/HomeScreenCustomizeHero';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenListEmpty() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<HomeScreenCustomizeHero />
		</View>
	);

	//
}
