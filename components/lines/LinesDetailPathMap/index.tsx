/* * */

import { MapView } from '@/components/map/MapView';
import { MapViewStyleActiveStops } from '@/components/map/MapViewStyleActiveStops';
import { MapViewStylePath } from '@/components/map/MapViewStylePath';
import { MapViewStyleVehicles } from '@/components/map/MapViewStyleVehicles';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { transformStopDataIntoGeoJsonFeature, useStopsContext } from '@/contexts/Stops.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { getCenterAndZoom } from '@/utils/map.utils';
import { Camera } from '@maplibre/maplibre-react-native';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

/* * */

interface Props {
	hasToolbar?: boolean
}

/* * */
export function LinesDetailPathMap({ hasToolbar }: Props) {
	//

	//
	// A. Setup variables

	const vehiclesContext = useVehiclesContext();
	const linesDetailContext = useLinesDetailContext();
	const stopsContext = useStopsContext();

	//
	// B. Fetch data

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

	// Calculate center and zoom for the path
	const fitPath = useMemo(() => {
		if (activePathFC?.features?.length) {
			return getCenterAndZoom(activePathFC.features, 1.2);
		}
		return null;
	}, [activePathFC]);

	const [camera, setCamera] = useState({
		centerCoordinate: fitPath?.center ?? [0, 0],
		zoomLevel: fitPath?.zoom ?? 10,
	});

	useEffect(() => {
		if (fitPath) {
			setCamera({
				centerCoordinate: fitPath.center,
				zoomLevel: fitPath.zoom,
			});
		}
	}, [fitPath]);

	//
	// C. Render components

	return (
		<View style={{ height: 360, width: '100%' }}>
			<MapView mapStyle="map" toolbar={hasToolbar}>
				<Camera
					animationDuration={1000}
					animationMode="flyTo"
					centerCoordinate={camera.centerCoordinate}
					zoomLevel={camera.zoomLevel}
				/>
				<MapViewStylePath
					shapeData={linesDetailContext.data.active_shape?.geojson}
					waypointsData={activePathFC ?? undefined}
				/>
				<MapViewStyleActiveStops stopsData={activeStopFC ?? undefined} />
				<MapViewStyleVehicles
					showCounter="always"
					vehiclesData={activeVehiclesFC ?? undefined}
					onVehiclePress={(id) => {
						router.push(`/vehicle/${id}`);
					}}
				/>
			</MapView>
		</View>
	);
}
