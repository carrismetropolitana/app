/* * */

import { VirtualizedListingLines } from '@/components/common/VitualizedListLines';
import { useLinesContext } from '@/contexts/Lines.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { SafeAreaView, StyleSheet } from 'react-native';

import { Surface } from '../common/layout/Surface';

/* * */
export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const themeContext = useThemeContext();
	const lines = linesContext.data.lines;

	const styles = StyleSheet.create({
		container: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			width: '100%',
		},
	});

	//
	// B. Render components

	return (
		<SafeAreaView style={styles.container}>
			<Surface>
				<VirtualizedListingLines data={lines} items={15} size="lg" />
			</Surface>
		</SafeAreaView>
	);

	//
}
