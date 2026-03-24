/* * */

import { MapOverlayPath, type MapOverlayPathShapeGeoJsonProperties, type MapOverlayPathWaypointGeoJsonProperties, transformShapeDataIntoGeoJsonFeature, transformWaypointDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlayPath';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map/view/MapView';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { IconArrowsMaximize } from '@tabler/icons-react-native';
import { bbox } from '@turf/turf';
import { router } from 'expo-router';
import { type LineString, type Point } from 'geojson';
import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineMapView({ isExpandable = false }: { isExpandable?: boolean }) {
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
	}, [lineDetailContext.data.selected_pattern_id, vehiclesContext.actions]);

	const shapeDataFC = useMemo(() => {
		if (!lineDetailContext.data.selected_shape?.geojson) return;
		const collection = getBaseGeoJsonFeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>();
		const feature = transformShapeDataIntoGeoJsonFeature(lineDetailContext.data.selected_shape, lineDetailContext.data.selected_pattern?.color, lineDetailContext.data.selected_pattern?.text_color);
		if (feature) collection.features.push(feature);
		return collection;
	}, [lineDetailContext.data.selected_pattern?.color, lineDetailContext.data.selected_pattern?.text_color, lineDetailContext.data.selected_shape]);

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
	}, [lineDetailContext.data.selected_pattern?.color, lineDetailContext.data.selected_pattern?.path, lineDetailContext.data.selected_pattern?.text_color, stopsContext.actions]);

	//
	// C. Handle actions

	const handleDidFinishLoadingMap = useCallback((cameraRef: CameraRef) => {
		if (!shapeDataFC) return false;
		const featureBounds = bbox(shapeDataFC);
		if (featureBounds.some(coord => !isFinite(coord))) return false;
		cameraRef.fitBounds(
			[featureBounds[2], featureBounds[3]],
			[featureBounds[0], featureBounds[1]],
			50, 0,
		);
		return true;
	}, [shapeDataFC]); // Only recreate if the data actually changes

	const handleOpen = useCallback(() => {
		router.push(`/(modals)/(line-modal)/${lineDetailContext.data.selected_line_id}/map`);
	}, [lineDetailContext.data.selected_line_id]);

	//
	// D. Render components

	return (
		<View style={isExpandable ? undefined : styles.fullscreenContainer}>
			{isExpandable ? (
				<View style={styles.previewContainer}>
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

					<Pressable onPress={handleOpen} style={styles.previewOverlay}>
						<View style={styles.expandButton}>
							<IconArrowsMaximize color="#FFFFFF" size={16} />
						</View>
					</Pressable>
				</View>
			) : (
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
			)}

		</View>
	);

	//
}
