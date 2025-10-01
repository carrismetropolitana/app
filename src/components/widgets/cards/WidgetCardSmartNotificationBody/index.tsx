/* * */

import { MapOverlayGeofence, mapOverlayGeofence_TopLayerId } from '@/components/map-new/overlays/MapOverlayGeofence';
import { MapOverlayPath, type MapOverlayPathShapeGeoJsonProperties, type MapOverlayPathWaypointGeoJsonProperties, transformShapeDataIntoGeoJsonFeature, transformWaypointDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayPath';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map-new/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map-new/view/MapView';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type WidgetSmartNotification } from '@/schemas/widgets';
import { type Pattern, type Shape } from '@carrismetropolitana/api-types/network';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { bbox } from '@turf/turf';
import { type LineString, type Point } from 'geojson';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardSmartNotificationBodyProps {
	data: WidgetSmartNotification
}

/* * */

export function WidgetCardSmartNotificationBody({ data }: WidgetCardSmartNotificationBodyProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const vehiclesContext = useVehiclesContext();

	const [isLoading, setIsLoading] = useState(true);

	const [currentPatternData, setCurrentPatternData] = useState<Pattern | undefined>(undefined);
	const [currentShapeData, setCurrentShapeData] = useState<Shape | undefined>(undefined);

	//
	// C. Fetch data

	useEffect(() => {
		(async () => {
			try {
				// Skip if no vehicle data or pattern id
				if (!data.properties.pattern_id) return;
				// Get current pattern version for today
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(data.properties.pattern_id);
				if (!validPatternData) return;
				setCurrentPatternData(validPatternData);
				// Skip if no shape id
				if (!validPatternData.shape_id) return;
				// Fetch shape data
				const shapeData = await linesContext.actions.getShapeDataById(validPatternData.shape_id);
				if (!shapeData) return;
				setCurrentShapeData(shapeData);
			}
			catch (err) {
				console.error(err);
			}
			finally {
				setIsLoading(false);
			}
		})();
	}, [data.properties.pattern_id]);

	//
	// C. Transform data

	const availableVehiclesDataFC = useMemo(() => {
		if (!data.properties.pattern_id) return;
		return vehiclesContext.actions.getVehiclesByPatternIdGeoJsonFC(data.properties.pattern_id);
	}, [data.properties.pattern_id, vehiclesContext.data.vehicles]);

	const shapeDataFC = useMemo(() => {
		if (!currentShapeData?.geojson) return;
		const collection = getBaseGeoJsonFeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>();
		const feature = transformShapeDataIntoGeoJsonFeature(currentShapeData, currentPatternData?.color, currentPatternData?.text_color);
		if (feature) collection.features.push(feature);
		return collection;
	}, [currentShapeData]);

	const waypointsDataFC = useMemo(() => {
		if (!currentPatternData?.path) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties>();
		collection.features = currentPatternData.path
			.map((item) => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				return transformWaypointDataIntoGeoJsonFeature(item, stopData, currentPatternData?.color, currentPatternData?.text_color);
			})
			.filter(i => !!i);
		return collection;
	}, [currentShapeData]);

	//
	// C. Handle actions

	const handleDidFinishLoadingMap = (cameraRef: CameraRef) => {
		// Skip if no geojson data
		if (!data.properties.geojson) return false;
		// Calculate feature bounds
		const featureBounds = bbox(data.properties.geojson);
		// Fit map to data.properties.geojson
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
	// C. Render components

	if (isLoading) {
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
					belowLayerId={mapOverlayGeofence_TopLayerId}
					shapeData={shapeDataFC}
					waypointsData={waypointsDataFC}
				/>
				<MapOverlayGeofence
					belowLayerId={mapOverlayVehicles_TopLayerId}
					geofenceData={data.properties.geojson}
				/>
				<MapOverlayVehicles
					vehiclesDataFC={availableVehiclesDataFC}
				/>
			</MapView>
		</View>
	);

	//
}
