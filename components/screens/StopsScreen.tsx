/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { SafeAreaView, StyleSheet } from 'react-native';

import { VirtualizedListing } from '../common/VitualizedList';

/* * */
export default function StopsScreen() {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const stops = stopsContext.data.stops;

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			width: '100%',
		},
	});

	//
	// C. Render components

	return (
		<SafeAreaView style={styles.container}>
			<VirtualizedListing data={stops} items={15} />
		</SafeAreaView>
	);

	//
}
