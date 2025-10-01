/* * */

import { MapOverlayStops, type MapOverlayStopsGeoJsonProperties } from '@/components/map-new/overlays/MapOverlayStops';
import { MapView } from '@/components/map-new/view/MapView';
import { type StopsSelectionProps } from '@/components/stops/selection/StopsSelection';
import { useStopsSelectionContext } from '@/contexts/StopsSelection.context';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { bbox } from '@turf/turf';
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

	const handleDidFinishLoadingMap = (cameraRef: CameraRef) => {
		// Skip if no shape data
		if (!stopsSelectionContext.data.filtered_fc) return false;
		// Calculate feature bounds
		const featureBounds = bbox(stopsSelectionContext.data.filtered_fc);
		// Fit map to bounds
		cameraRef.fitBounds(
			[featureBounds[2], featureBounds[3]],
			[featureBounds[0], featureBounds[1]],
			10, // padding around bounds
			1000, // animation duration in ms
		);
		// Return true to indicate success
		// and avoid further attempts
		return true;
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView
				onDidFinishLoadingMap={handleDidFinishLoadingMap}
				withUserLocation
			>
				<MapOverlayStops
					onSelectStop={handleSelectStop}
					stopsData={stopsSelectionContext.data.filtered_fc}
				/>
			</MapView>
		</View>
	);
}
