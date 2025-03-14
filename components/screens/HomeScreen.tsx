/* * */
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { transformStopDataIntoGeoJsonFeature, useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { useMap } from '@/hooks/useMap';
import { centerMap, getBaseGeoJsonFeatureCollection, moveMap } from '@/utils/map.utils';
import { Link } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, View } from 'react-native';

import { CustomMapView } from '../map/MapView';
// import { MapViewStyleActiveStops, MapViewStyleActiveStopsPrimaryLayerId } from '../map/MapViewStyleActiveStops';
// import { MapViewStylePath, MapViewStylePathInteractiveLayerId } from '../map/MapViewStylePath';
// import { MapViewStyleVehicles, MapViewStyleVehiclesPrimaryLayerId } from '../map/MapViewStyleVehicles';

/* * */

export default function HomeScreen() {
	// Context hooks
	const { t } = useTranslation();
	const localeContext = useLocaleContext();
	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const vehiclesContext = useVehiclesContext();
	//	const linesDetailContext = useLinesDetailContext();
	// const linesDetailMapRef = useMap();

	// // Memoized data transformations
	// const activeVehiclesFeatureCollection = useMemo(() => {
	// 	if (!linesDetailContext.data.active_pattern?.id) return;
	// 	return vehiclesContext.actions.getVehiclesByPatternIdGeoJsonFC(linesDetailContext.data.active_pattern.id);
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
	// }, [linesDetailContext.data.active_pattern, stopsContext.actions]);

	// const activeStopFeatureCollection = useMemo(() => {
	// 	if (!linesDetailContext.data.active_waypoint || !linesDetailContext.data.active_pattern) return;
	// 	const foundStop = stopsContext.actions.getStopById(linesDetailContext.data.active_waypoint.stop_id);
	// 	if (!foundStop) return;
	// 	const result = transformStopDataIntoGeoJsonFeature(foundStop);
	// 	result.properties = {
	// 		...result.properties,
	// 		color: linesDetailContext.data.active_pattern.color,
	// 		text_color: linesDetailContext.data.active_pattern.text_color,
	// 	};
	// 	const collection = getBaseGeoJsonFeatureCollection();
	// 	collection.features.push(result);
	// 	return collection;
	// }, [linesDetailContext.data.active_waypoint, linesDetailContext.data.active_pattern, stopsContext.actions]);

	// // Map interaction handlers
	// useEffect(() => {
	// 	if (!linesDetailMapRef.current) return;

	// 	if (linesDetailContext.flags.is_interactive_mode) {
	// 		if (!linesDetailContext.data.active_waypoint) return;
	// 		const stopData = stopsContext.actions.getStopById(linesDetailContext.data.active_waypoint.stop_id);
	// 		if (!stopData) return;
	// 		moveMap(linesDetailMapRef.current, [stopData.lon, stopData.lat]);
	// 	}
	// 	else {
	// 		if (!linesDetailContext.data.active_shape?.geojson) return;
	// 		centerMap(linesDetailMapRef.current, [linesDetailContext.data.active_shape.geojson], { padding: 60 });
	// 	}
	// }, [linesDetailContext, linesDetailMapRef.current]);

	// const handleLayerClick = (event) => {
	// 	try {
	// 		const features = event.features;

	// 		if (!features || !linesDetailContext.data.active_waypoint) return;

	// 		const relevantFeature = features.find(feature =>
	// 			feature.layer.id === MapViewStylePathInteractiveLayerId
	// 			&& feature.properties?.id !== linesDetailContext.data.active_waypoint?.stop_id,
	// 		);

	// 		if (relevantFeature?.properties) {
	// 			linesDetailContext.actions.setActiveWaypoint(
	// 				relevantFeature.properties.id,
	// 				relevantFeature.properties.sequence,
	// 			);
	// 		}
	// 	}
	// 	catch (error) {
	// 		console.error('Error handling map click:', error);
	// 	}
	// };

	// Styles
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
			fontWeight: '900',
			textTransform: 'uppercase',
		},
		textBIG: {
			color: 'rgba(150, 150, 160, 1)',
			fontSize: 35,
			fontWeight: '900',
			textTransform: 'uppercase',
		},
	});

	return (
		<View style={styles.container}>
			<CustomMapView />

			<Text style={styles.text}>Home</Text>
			<Link href="/profile">Open profile</Link>
			<Text>{t('hello')}</Text>

			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Vehicle Count: {vehiclesContext.data.vehicles.length}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Lines Count: {linesContext.data.lines.length}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Current Locale: {localeContext.locale}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text style={styles.textBIG}>Stop Count: {stopsContext.data.stops.length}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Button onPress={localeContext.actions.changeToEnglish} title="Switch to English" />
				<Button onPress={localeContext.actions.changeToPortuguese} title="Switch to Portuguese" />
			</View>
		</View>
	);
}
