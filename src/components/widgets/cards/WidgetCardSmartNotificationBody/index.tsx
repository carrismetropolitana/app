/* * */

import { MapOverlayGeofence, mapOverlayGeofence_TopLayerId } from '@/components/map/overlays/MapOverlayGeofence';
import { MapOverlayPath, type MapOverlayPathShapeGeoJsonProperties, type MapOverlayPathWaypointGeoJsonProperties, transformShapeDataIntoGeoJsonFeature, transformWaypointDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlayPath';
import { MapOverlaySelectedStops, mapOverlaySelectedStops_TopLayerId, type MapOverlaySelectedStopsGeoJsonProperties, transformSelectedStopDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlaySelectedStops';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map/view/MapView';
import { useLinesContext } from '@/contexts/Lines.context';
import { type HubPattern, type HubShape } from '@tmlmobilidade/go-types-public-info';
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
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';

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
	const operationalDateContext = useOperationalDateContext();

	const [isLoading, setIsLoading] = useState(true);

	const [currentPatternData, setCurrentPatternData] = useState<HubPattern | undefined>(undefined);
	const [currentShapeData, setCurrentShapeData] = useState<HubShape | undefined>(undefined);

	//
	// C. Fetch data

	useEffect(() => {
		(async () => {
			try {
				// Skip if no vehicle data or pattern id
				if (!data.properties.pattern_id) return;
				// Get current pattern version for today
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(data.properties.pattern_id, operationalDateContext.data.today.operational_date_int);
				if (!validPatternData) return;
				setCurrentPatternData(validPatternData);
				// Skip if no shape id
				if (!validPatternData.shape_id) return;
				// Fetch shape data
				const shapeData = await linesContext.actions.getShapeDataById(validPatternData.shape_id);
				if (!shapeData) return;
				setCurrentShapeData(shapeData);
			} catch (err) {
				console.error(err);
			} finally {
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

	const selectedStopDataFC = useMemo(() => {
		if (!currentPatternData?.path) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlaySelectedStopsGeoJsonProperties>();
		const selectedStopData = stopsContext.actions.getStopById(data.properties.stop_id);
		if (!selectedStopData) return collection;
		const feature = transformSelectedStopDataIntoGeoJsonFeature(selectedStopData);
		if (!feature) return collection;
		collection.features.push(feature);
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
			[featureBounds[0], featureBounds[1], featureBounds[2], featureBounds[3]],
			{
				duration: 0,
				padding: { bottom: 50, left: 50, right: 50, top: 50 },
			},
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
					belowLayerId={mapOverlaySelectedStops_TopLayerId}
					geofenceData={data.properties.geojson}
				/>
				<MapOverlaySelectedStops
					belowLayerId={mapOverlayVehicles_TopLayerId}
					selectedStopsData={selectedStopDataFC}
				/>
				<MapOverlayVehicles
					vehiclesDataFC={availableVehiclesDataFC}
				/>
			</MapView>
		</View>
	);

	//
}
