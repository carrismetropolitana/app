/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { useSystemVariables } from '@/theme/global';
import { GeoJSONSource, Layer, type PressEventWithFeatures } from '@maplibre/maplibre-react-native';
import { HubStop } from '@tmlmobilidade/go-types-public-info';
import { type Feature, type FeatureCollection, type Point } from 'geojson';
import { type NativeSyntheticEvent } from 'react-native';

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

	const handlePress = (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
		// Skip if no callback
		if (!onSelectStop) return;
		// Get feature and call callback
		const matchingFeature = event.nativeEvent.features.find(f => f.properties?.id) as Feature<Point, MapOverlayStopsGeoJsonProperties> | undefined;
		if (matchingFeature) onSelectStop(matchingFeature.properties);
	};

	//
	// C. Render components

	return (
		<GeoJSONSource data={stopsData ?? baseStopsFC} id="source-stops-all" onPress={handlePress}>
			<Layer
				beforeId={belowLayerId}
				id={mapOverlayStops_TopLayerId}
				type="circle"
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
		</GeoJSONSource>
	);

	//
}

/* * */

export function transformStopDataIntoGeoJsonFeature(stopData: HubStop): Feature<Point, MapOverlayStopsGeoJsonProperties> | undefined {
	// Validate input
	if (!stopData.longitude) return;
	if (!stopData.latitude) return;
	// Transform and return
	return {
		geometry: {
			coordinates: [stopData.longitude, stopData.latitude],
			type: 'Point',
		},
		properties: {
			_type: 'stop',
			id: stopData._id.toString(),
		},
		type: 'Feature',
	};
}
