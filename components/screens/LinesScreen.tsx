/* * */

import { VirtualizedListingLines } from '@/components/common/VitualizedListLines';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Section } from '../common/layout/Section';

/* * */

export default function LinesScreen() {
	//

	// A. Setup Variables

	const linesListContext = useLinesListContext();
	const linesContext = useLinesContext();
	const locationContext = useLocationsContext();
	const themeContext = useThemeContext();

	const lines = linesContext.data.lines;
	const linesAroundLocation = linesListContext.data.linesAroundLocation;

	const styles = StyleSheet.create({
		container: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			width: '100%',
		},
	});

	//
	// B. Render Components

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				<Section heading="A minha volta" />
				{locationContext.data.locationPermission === 'granted' && linesAroundLocation.length > 0 && (
					<VirtualizedListingLines
						data={linesAroundLocation}
						items={5}
						size="lg"
					/>
				)}
				<Section heading="Todas as linhas" />
				<VirtualizedListingLines data={lines} items={5} size="lg" />
			</ScrollView>
		</SafeAreaView>
	);

	//
}
