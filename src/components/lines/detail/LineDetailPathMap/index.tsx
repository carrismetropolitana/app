/* * */

import { MapOverlayPath, type MapOverlayPathShapeGeoJsonProperties, type MapOverlayPathWaypointGeoJsonProperties, transformShapeDataIntoGeoJsonFeature, transformWaypointDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayPath';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map-new/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map-new/view/MapView';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { bbox } from '@turf/turf';
import { type LineString, type Point } from 'geojson';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailPathMap() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const stopsContext = useStopsContext();
	const vehiclesContext = useVehiclesContext();
	const lineDetailContext = useLineDetailContext();

	//
	// B. Transform data

	const availableVehiclesDataFC = useMemo(() => {
		if (!lineDetailContext.data.selected_pattern_id) return;
		return vehiclesContext.actions.getVehiclesByPatternIdGeoJsonFC(lineDetailContext.data.selected_pattern_id);
	}, [lineDetailContext.data.selected_pattern_id, vehiclesContext.data.vehicles]);

	const shapeDataFC = useMemo(() => {
		if (!lineDetailContext.data.selected_shape?.geojson) return;
		const collection = getBaseGeoJsonFeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>();
		const feature = transformShapeDataIntoGeoJsonFeature(lineDetailContext.data.selected_shape, lineDetailContext.data.selected_pattern?.color, lineDetailContext.data.selected_pattern?.text_color);
		if (feature) collection.features.push(feature);
		return collection;
	}, [lineDetailContext.data.selected_shape]);

	const waypointsDataFC = useMemo(() => {
		if (!lineDetailContext.data.selected_pattern?.path) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties>();
		collection.features = lineDetailContext.data.selected_pattern.path
			.map((item) => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				return transformWaypointDataIntoGeoJsonFeature(item, stopData, lineDetailContext.data.selected_pattern?.color, lineDetailContext.data.selected_pattern?.text_color);
			})
			.filter(i => !!i);
		return collection;
	}, [lineDetailContext.data.selected_pattern]);

	//
	// C. Handle actions

	const handleDidFinishLoadingMap = (cameraRef: CameraRef) => {
		// Skip if no shape data
		if (!shapeDataFC) return false;
		// Calculate feature bounds
		const featureBounds = bbox(shapeDataFC);
		// Fit map to bounds
		cameraRef.fitBounds(
			[featureBounds[2], featureBounds[3]],
			[featureBounds[0], featureBounds[1]],
			50, // padding around bounds
			0, // animation duration in ms
		);
		// Return true to indicate success
		// and avoid further attempts
		return true;
	};

	//
	// D. Render components

	if (lineDetailContext.flags.loading) {
		return (
			<View style={[styles.container, styles.loading]}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				onDidFinishLoadingMap={handleDidFinishLoadingMap}
				vehiclesCounterQty={availableVehiclesDataFC?.features.length ?? 0}
			>
				<MapOverlayPath
					belowLayerId={mapOverlayVehicles_TopLayerId}
					shapeData={shapeDataFC}
					waypointsData={waypointsDataFC}
				/>
				<MapOverlayVehicles
					vehiclesDataFC={availableVehiclesDataFC}
				/>
			</MapView>
		</View>
	);

	//
}
