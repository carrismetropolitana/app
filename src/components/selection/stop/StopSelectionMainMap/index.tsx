/* * */

import { MapOverlayStops, type MapOverlayStopsGeoJsonProperties } from '@/components/map/overlays/MapOverlayStops';
import { MapView, MapViewRef } from '@/components/map/view/MapView';
import { useStopSelectionContext } from '@/components/selection/stop/context/StopSelection.context';
import { type StopSelectionProps } from '@/components/selection/stop/StopSelection';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { bbox } from '@turf/turf';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function StopSelectionMainMap({ onSelect }: StopSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const mapViewRef = useRef<MapViewRef>(null);

	const stopsSelectionContext = useStopSelectionContext();

	//
	// B. Handle actions

	const handleSelectStop = (item: MapOverlayStopsGeoJsonProperties) => {
		if (!onSelect) return;
		onSelect(item.id);
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

	useEffect(() => {
		// Skip if no ref or no data
		if (!mapViewRef.current?.camera_ref) return;
		if (!stopsSelectionContext.data.filtered_fc) return;
		// Skip if no search filter (user likely wants to see all data)
		if (!stopsSelectionContext.filters.by_search) return;
		// Calculate feature bounds
		const featureBounds = bbox(stopsSelectionContext.data.filtered_fc);
		// Fit map to bounds
		mapViewRef.current.camera_ref.fitBounds(
			[featureBounds[2], featureBounds[3]],
			[featureBounds[0], featureBounds[1]],
			50, // padding around bounds
			500, // animation duration in ms
		);
	}, [stopsSelectionContext.filters.by_search]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView
				ref={mapViewRef}
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
