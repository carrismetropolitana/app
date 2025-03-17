/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<VirtualizedListing data={stops} />
			</SafeAreaView>
		</SafeAreaProvider>
	);

	//
}
