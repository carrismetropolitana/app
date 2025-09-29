/* * */

import { MapOverlayStops, MapOverlayStopsGeoJsonProperties } from '@/components/map-new/overlays/MapOverlayStops';
import { MapView } from '@/components/map-new/view/MapView';
import { type StopsSelectionProps } from '@/components/stops/selection/StopsSelection';
import { useStopsSelectionContext } from '@/contexts/StopsSelection.context';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopsSelectionMainMap({ onPress }: StopsSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsSelectionContext = useStopsSelectionContext();

	//
	// B. Handle actions

	const handleSelectStop = (item: MapOverlayStopsGeoJsonProperties) => {
		if (!onPress) return;
		onPress(item);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView withUserLocation>
				<MapOverlayStops
					onSelectStop={handleSelectStop}
					stopsData={stopsSelectionContext.data.filtered_fc}
				/>
			</MapView>
		</View>
	);
}
