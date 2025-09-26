/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { useSystemVariables } from '@/theme/global';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { CircleLayer, type OnPressEvent, ShapeSource } from '@maplibre/maplibre-react-native';
import { type Feature, type FeatureCollection, type Point } from 'geojson';

/* * */

export const mapOverlayStops_TopLayerId = 'stops-circle-layer';
export const mapOverlayStops_InteractiveLayerIds = [mapOverlayStops_TopLayerId];

/* * */

export interface MapOverlayStopsGeoJsonProperties {
	_type: 'stop'
	id: string
}
/* * */

interface MapOverlayStopsProps {
	belowLayerId?: string
	onSelectStop?: (stop: MapOverlayStopsGeoJsonProperties) => void
	stopsData?: FeatureCollection<Point, MapOverlayStopsGeoJsonProperties>
}

/* * */

export function MapOverlayStops({ belowLayerId, onSelectStop, stopsData }: MapOverlayStopsProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const baseStopsFC = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();

	//
	// B. Handle actions

	const handlePress = (event: OnPressEvent) => {
		// Skip if no callback
		if (!onSelectStop) return;
		// Get feature and call callback
		const matchingFeature = event.features.find(f => f.properties?.id) as Feature<Point, MapOverlayStopsGeoJsonProperties> | undefined;
		if (matchingFeature) onSelectStop(matchingFeature.properties);
	};

	//
	// C. Render components

	return (
		<ShapeSource id="source-stops-all" onPress={handlePress} shape={stopsData ?? baseStopsFC}>
			<CircleLayer
				belowLayerID={belowLayerId}
				id={mapOverlayStops_TopLayerId}
				style={{
					circleColor: [
						'match',
						['get', 'current_status'],
						'inactive', '#e6e6e6', systemVariables.brand.cm,
					],
					circlePitchAlignment: 'map',
					circleRadius: [
						'interpolate',
						['linear'],
						['zoom'],
						9, // min zoom level
						2, // min radius
						26, // max zoom level
						22, // max radius
					],
					circleStrokeColor: [
						'match',
						['get', 'current_status'],
						'inactive', '#969696',
						'voided', '#cc5533',
						'#000000', // default
					],
					circleStrokeWidth: [
						'interpolate',
						['linear'],
						['zoom'],
						9, // min zoom level
						1, // min width
						26, // max zoom level
						8, // max width
					],
					visibility: stopsData ? 'visible' : 'none',
				}}
			/>
		</ShapeSource>
	);

	//
}

/* * */

export function transformStopDataIntoGeoJsonFeature(stopData: Stop): Feature<Point, MapOverlayStopsGeoJsonProperties> {
	return {
		geometry: {
			coordinates: [stopData.lon, stopData.lat],
			type: 'Point',
		},
		properties: {
			_type: 'stop',
			id: stopData.id,
		},
		type: 'Feature',
	};
}
