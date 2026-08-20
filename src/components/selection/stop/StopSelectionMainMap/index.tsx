/* * */

import { MapOverlayStops, type MapOverlayStopsGeoJsonProperties } from '@/components/map/overlays/MapOverlayStops';
import { MapView, MapViewRef } from '@/components/map/view/MapView';
import { useStopSelectionContext } from '@/components/selection/stop/context/StopSelection.context';
import { type StopSelectionProps } from '@/components/selection/stop/StopSelection';
import { type GeolocationPosition } from '@maplibre/maplibre-react-native';
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
	const hasCenteredOnUserRef = useRef(false);
	const lastFittedSearchRef = useRef('');

	const stopsSelectionContext = useStopSelectionContext();

	//
	// B. Handle actions

	const handleSelectStop = (item: MapOverlayStopsGeoJsonProperties) => {
		if (!onSelect) return;
		onSelect(item.id);
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	const handleUserLocationUpdate = (location: GeolocationPosition) => {
		if (hasCenteredOnUserRef.current) return;
		const cameraRef = mapViewRef.current?.camera_ref;
		const coords = location?.coords;
		if (!cameraRef || !coords) return;

		cameraRef.easeTo({
			center: [coords.longitude, coords.latitude],
			duration: 1000,
			zoom: 15,
		});

		hasCenteredOnUserRef.current = true;
	};

	useEffect(() => {
		const cameraRef = mapViewRef.current?.camera_ref;
		const search = stopsSelectionContext.filters.by_search.trim();
		const fc = stopsSelectionContext.data.filtered_fc;

		if (!cameraRef) return;
		if (!search) return;
		if (!fc?.features?.length) return;
		if (lastFittedSearchRef.current === search) return;

		const featureBounds = bbox(fc);

		cameraRef.fitBounds(
			[featureBounds[0], featureBounds[1], featureBounds[2], featureBounds[3]],
			{
				duration: 500,
				padding: { bottom: 50, left: 50, right: 50, top: 50 },
			},
		);

		lastFittedSearchRef.current = search;
	}, [stopsSelectionContext.filters.by_search, stopsSelectionContext.data.filtered_fc]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView
				ref={mapViewRef}
				onUserLocationUpdate={handleUserLocationUpdate}
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
