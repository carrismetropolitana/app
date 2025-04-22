import { VirtualizedListingLines } from '@/components/common/VitualizedListLines';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { Line } from '@carrismetropolitana/api-types/network';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Section } from '../common/layout/Section';

export default function LinesScreen() {
	const linesListContext = useLinesListContext();
	const linesContext = useLinesContext();
	const themeContext = useThemeContext();
	const locationContext = useLocationsContext();
	const lines = linesContext.data.lines;

	const [linesAroundLocation, setLinesLocation] = useState<Line[]>([]);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			flex: 1,
			width: '100%',
		},
	});

	useEffect(() => {
		if (locationContext.data.locationPermission !== 'granted') return;
		const fetchNearby = async () => {
			const nearby = await linesListContext.actions.getLinesAroundLocation();
			if (nearby) setLinesLocation(nearby);
		};
		fetchNearby();
	}, [locationContext.data.locationPermission]);

	useEffect(() => {
		if (locationContext.data.locationPermission !== 'granted') return;
		setLinesLocation(linesListContext.data.linesAroundLocation);
	}, [linesListContext.data.linesAroundLocation]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				<Section heading="A minha volta" />
				{locationContext.data.locationPermission === 'granted'
				&& Array.isArray(linesAroundLocation)
				&& linesAroundLocation.length > 0 && (
					<VirtualizedListingLines
						data={linesAroundLocation}
						items={50}
						size="lg"
					/>
				)}

				<Section heading="Todas as linhas" />
				<VirtualizedListingLines data={lines} items={15} size="lg" />
			</ScrollView>
		</SafeAreaView>
	);
}
