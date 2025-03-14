/* * */
// import { MapView } from '@/components/map/MapView';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
// import { centerMap, getBaseGeoJsonFeatureCollection, moveMap } from '@/utils/map.utils';
// import { MapView } from '@maplibre/maplibre-react-native';
// import { useMap } from '@maplibre/maplibre-react-native';
import { Link } from 'expo-router';
// import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, View } from 'react-native';

// import { MapViewStyleActiveStops, MapViewStyleActiveStopsPrimaryLayerId } from '../map/MapViewStyleActiveStops';
// import { MapViewStylePath, MapViewStylePathInteractiveLayerId } from '../map/MapViewStylePath';
// import { MapViewStyleVehicles, MapViewStyleVehiclesPrimaryLayerId } from '../map/MapViewStyleVehicles';
/* * */

export default function HomeScreen() {
	//

	//
	// A. Setup variables
	const { t } = useTranslation();
	const localeContext = useLocaleContext();
	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const vehiclesContext = useVehiclesContext();
	// const linesDetailContext = useLinesDetailContext();

	// const { linesDetailMap } = useMap();

	//
	// B. Transform Data

	// const activeVehiclesFeatureCollection = useMemo(() => {
	// 	if (!linesDetailContext.data.active_pattern?.id) return;
	// 	return vehiclesContext.actions.getVehiclesByPatternIdGeoJsonFC(linesDetailContext.data.active_pattern?.id);
	// }, [linesDetailContext.data.active_pattern, vehiclesContext.data.vehicles]);

	// const activePathFeatureCollection = useMemo(() => {
	// 	if (!linesDetailContext.data.active_pattern?.path) return;
	// 	const collection = getBaseGeoJsonFeatureCollection();
	// 	linesDetailContext.data.active_pattern.path.forEach((pathStop) => {
	// 		const stopData = stopsContext.actions.getStopById(pathStop.stop_id);
	// 		if (!stopData) return;
	// 		const result = transformStopDataIntoGeoJsonFeature(stopData);
	// 		result.properties = {
	// 			...result.properties,
	// 			color: linesDetailContext.data.active_pattern?.color,
	// 			sequence: pathStop.stop_sequence,
	// 			text_color: linesDetailContext.data.active_pattern?.text_color,
	// 		};
	// 		collection.features.push(result);
	// 	});
	// 	return collection;
	// }, [linesDetailContext.data.active_pattern, vehiclesContext.data.vehicles]);

	// const activeStopFeatureCollection = useMemo(() => {
	// 	// Exit early if there is no active pattern or active waypoint
	// 	if (!linesDetailContext.data.active_waypoint || !linesDetailContext.data.active_pattern) return;
	// 	// Get the stop data for the active waypoint and transform it into a GeoJSON feature
	// 	const foundStop = stopsContext.actions.getStopById(linesDetailContext.data.active_waypoint.stop_id);
	// 	if (!foundStop) return;
	// 	const result = transformStopDataIntoGeoJsonFeature(foundStop);
	// 	result.properties = {
	// 		...result.properties,
	// 		color: linesDetailContext.data.active_pattern.color,
	// 		text_color: linesDetailContext.data.active_pattern.text_color,
	// 	};
	// 	// Create a new feature collection and add the active waypoint feature to it
	// 	const collection = getBaseGeoJsonFeatureCollection();
	// 	collection.features.push(result);
	// 	return collection;
	// 	//
	// }, [linesDetailContext.data.active_waypoint, linesDetailContext.data.active_pattern]);

	// //
	// // C. Handle Actions

	// useEffect(() => {
	// 	// If map is not yet in interactive mode, then that means the user has not yet selected a stop.
	// 	// Center the map on the full shape and path of the selected pattern.
	// 	// After the user selects a stop, move map to the selected stop.
	// 	if (linesDetailContext.flags.is_interactive_mode) {
	// 		if (!linesDetailContext.data.active_waypoint) return;
	// 		const stopData = stopsContext.actions.getStopById(linesDetailContext.data.active_waypoint.stop_id);
	// 		if (!stopData) return;
	// 		moveMap(linesDetailMap, [stopData.lon, stopData.lat]);
	// 	}
	// 	else {
	// 		if (!linesDetailContext.data.active_shape?.geojson) return;
	// 		centerMap(linesDetailMap, [linesDetailContext.data.active_shape.geojson], { padding: 60 });
	// 	}
	// }, [linesDetailMap, linesDetailContext.data.active_waypoint, linesDetailContext.data.active_shape]);

	// function handleLayerClick(event) {
	// 	if (!linesDetailMap) return;
	// 	const features = linesDetailMap.queryRenderedFeatures(event.point, { layers: [MapViewStylePathInteractiveLayerId] });
	// 	if (!features.length) return;
	// 	for (const feature of features) {
	// 		if (feature.properties.id !== linesDetailContext.data.active_waypoint?.stop_id) {
	// 			linesDetailContext.actions.setActiveWaypoint(feature.properties.id, feature.properties.sequence);
	// 			return;
	// 		}
	// 	}
	// }

	// function handleCenterMap() {
	// 	if (!linesDetailContext.data.active_shape?.geojson) return;
	// 	centerMap(linesDetailMap, [linesDetailContext.data.active_shape.geojson], { padding: 60 });
	// }

	const styles = StyleSheet.create({
		container: {
			alignItems: 'center',
			backgroundColor: '#fff',
			flex: 1,
			fontFamily: 'Inter',
			justifyContent: 'center',
		},
		text: {
			color: 'rgba(150, 150, 160, 1)',
			fontSize: 20,
			fontWeight: 900,
			textTransform: 'uppercase',
		},
		textBIG: {
			color: 'rgba(150, 150, 160, 1)',
			fontSize: 35,
			fontWeight: 900,
			textTransform: 'uppercase',
		},
	});

	//
	// B. Render components

	return (
		<View style={styles.container}>

			{/* <MapView
				id="linesDetailMap"
				interactiveLayerIds={[MapViewStylePathInteractiveLayerId]}
				onCenterMap={handleCenterMap}
				onClick={handleLayerClick}
			>

				<MapViewStyleVehicles
					showCounter="always"
					vehiclesData={activeVehiclesFeatureCollection}
				/>

				<MapViewStyleActiveStops
					presentBeforeId={MapViewStyleVehiclesPrimaryLayerId}
					stopsData={activeStopFeatureCollection}
				/>

				<MapViewStylePath
					presentBeforeId={MapViewStyleActiveStopsPrimaryLayerId}
					shapeData={linesDetailContext.data.active_shape?.geojson}
					waypointsData={activePathFeatureCollection}
				/>

			</MapView> */}
			{/* <MapView style={{ flex: 1 }} /> */}
			<Text style={styles.text}>Home</Text>
			<Link href="/profile">Open profile</Link>
			<Text>{t('hello')}</Text>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Vehicle Count : {vehiclesContext.data.vehicles.length}</Text>
			</View>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Lines Count : {linesContext.data.lines.length}</Text>
			</View>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Current Locale : {localeContext.locale}</Text>
			</View>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Stop Count : {stopsContext.data.stops.length}</Text>
			</View>

			<View style={{ marginTop: 10 }}>
				<Button onPress={localeContext.actions.changeToEnglish} title="Switch to English" />
				<Button onPress={localeContext.actions.changeToPortuguese} title="Switch to Portuguese" />
			</View>
		</View>
	);

	//
}
