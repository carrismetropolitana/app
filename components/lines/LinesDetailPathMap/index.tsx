import { MapView } from '@/components/map/MapView';
import { MapViewStyleActiveStops } from '@/components/map/MapViewStyleActiveStops';
import { INTERACTIVE_LAYER_ID, MapViewStylePath } from '@/components/map/MapViewStylePath';
import { MapViewStyleVehicles } from '@/components/map/MapViewStyleVehicles';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { transformStopDataIntoGeoJsonFeature, useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { centerMap, moveMap } from '@/utils/map.utils';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';

export function LinesDetailPathMap() {
	const { data: mapData } = useMapOptionsContext();
	const vehiclesContext = useVehiclesContext();
	const linesDetailContext = useLinesDetailContext();
	const stopsContext = useStopsContext();

	const activeVehiclesFC = useMemo(() => {
		const patternId = linesDetailContext.data.active_pattern?.id;
		if (!patternId) return null;
		return vehiclesContext.actions.getVehiclesByPatternIdGeoJsonFC(patternId);
	}, [vehiclesContext.data.vehicles, linesDetailContext.data.active_pattern]);

	const activePathFC = useMemo(() => {
		const pat = linesDetailContext.data.active_pattern;
		if (!pat?.path) return null;
		const coll = getBaseGeoJsonFeatureCollection();
		pat.path.forEach((p) => {
			const stop = stopsContext.actions.getStopById(p.stop_id);
			if (!stop) return;
			const feat = transformStopDataIntoGeoJsonFeature(stop);
			feat.properties = {
				...feat.properties,
				color: pat.color,
				sequence: p.stop_sequence,
				stop_id: p.stop_id,
				text_color: pat.text_color,
			};
			coll.features.push(feat);
		});
		return coll;
	}, [linesDetailContext.data.active_pattern]);

	const activeStopFC = useMemo(() => {
		const wp = linesDetailContext.data.active_waypoint;
		const pat = linesDetailContext.data.active_pattern;
		if (!wp || !pat) return null;
		const stop = stopsContext.actions.getStopById(wp.stop_id);
		if (!stop) return null;
		const feat = transformStopDataIntoGeoJsonFeature(stop);
		feat.properties = {
			...feat.properties,
			color: pat.color,
			stop_id: wp.stop_id,
			text_color: pat.text_color,
		};
		const coll = getBaseGeoJsonFeatureCollection();
		coll.features.push(feat);
		return coll;
	}, [linesDetailContext.data.active_waypoint, linesDetailContext.data.active_pattern]);

	// Center map on path or stop using utils
	const handleCenterMap = useCallback(() => {
		const map = mapData.map;
		if (!map) return;

		if (activePathFC?.features.length) {
			centerMap(map, activePathFC.features);
		}
		else if (activeStopFC?.features.length) {
			const coord = activeStopFC.features[0].geometry.coordinates as [number, number];
			moveMap(map, coord);
		}
	}, [mapData.map, activePathFC, activeStopFC]);

	const handlePress = useCallback(
		async (e: any) => {
			const map = mapData.map;
			if (!map) return;
			console.log(mapData.map);
			const { screenPointX, screenPointY } = e.nativeEvent;
			const featureCollection = await map.queryRenderedFeaturesAtPoint(
				[screenPointX, screenPointY],
				[],
				[INTERACTIVE_LAYER_ID],
			);

			if (!featureCollection?.features?.length) return;

			const feature = featureCollection.features[0];
			const props = feature.properties as any;

			linesDetailContext.actions.setActiveWaypoint(props.stop_id, props.sequence);

			// Recenter on selected stop
			const coord = feature.geometry?.type === 'Point' ? feature.geometry.coordinates as [number, number] : undefined;
			if (coord) {
				moveMap(map, coord);
			}
			console.log('Selected stop:', props.stop_id, props.sequence);
		},
		[mapData.map, linesDetailContext.actions],
	);

	return (
		<View style={{ height: 360, width: '100%' }}>
			<MapView mapStyle="map" onCenterMap={handleCenterMap} onPress={handlePress}>
				<MapViewStylePath
					shapeData={linesDetailContext.data.active_shape?.geojson}
					waypointsData={activePathFC ?? undefined}
				/>
				<MapViewStyleActiveStops stopsData={activeStopFC ?? undefined} />
				<MapViewStyleVehicles showCounter="positive" vehiclesData={activeVehiclesFC ?? undefined} />
			</MapView>
		</View>
	);
}
