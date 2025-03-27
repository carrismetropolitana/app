/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { SafeAreaView, StyleSheet } from 'react-native';

import { VirtualizedListing } from '../common/VitualizedList';

/* * */
export default function StopsScreen() {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const themeContext = useThemeContext();
	const stops = stopsContext.data.stops;

	const styles = StyleSheet.create({
		container: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
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
