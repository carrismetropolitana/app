/* * */

import { VirtualizedListing } from '@/components/common/VitualizedList';
import { useLinesContext } from '@/contexts/Lines.context';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */
export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const lines = linesContext.data.lines;

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			marginTop: StatusBar.currentHeight,
		},
	});

	//
	// C. Render components

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<VirtualizedListing data={lines} items={30} size="lg" variant="lines" />
			</SafeAreaView>
		</SafeAreaProvider>
	);

	//
}
