/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { useSystemVariables } from '@/theme/global';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { GeoJSONSource, Layer, type PressEventWithFeatures } from '@maplibre/maplibre-react-native';
import { type Feature, type FeatureCollection, type Point } from 'geojson';
import { type NativeSyntheticEvent } from 'react-native';

/* * */

export const mapOverlaySelectedStops_TopLayerId = 'selected-stops-pole-layer';
export const mapOverlaySelectedStops_InteractiveLayerIds = [mapOverlaySelectedStops_TopLayerId];

/* * */

export interface MapOverlaySelectedStopsGeoJsonProperties {
	_type: 'selected-stop'
	id: string
}

/* * */

interface MapOverlaySelectedStopsProps {
	belowLayerId?: string
	onSelectFeature?: (properties: MapOverlaySelectedStopsGeoJsonProperties) => void
	selectedStopsData?: FeatureCollection<Point, MapOverlaySelectedStopsGeoJsonProperties>
}

/* * */

export function MapOverlaySelectedStops({ belowLayerId, onSelectFeature, selectedStopsData }: MapOverlaySelectedStopsProps) {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	const baseStopsFC = getBaseGeoJsonFeatureCollection<Point, MapOverlaySelectedStopsGeoJsonProperties>();

	//
	// B. Handle actions

	const handlePress = (event: NativeSyntheticEvent<PressEventWithFeatures>) => {
		// Skip if no callback
		if (!onSelectFeature) return;
		// Get feature and call callback
		const matchingFeature = event.nativeEvent.features.find(f => f.properties?.id) as Feature<Point, MapOverlaySelectedStopsGeoJsonProperties> | undefined;
		if (matchingFeature) onSelectFeature(matchingFeature.properties);
	};

	//
	// C. Render components

	return (
		<GeoJSONSource data={selectedStopsData ?? baseStopsFC} id="source-selected-stops-all" onPress={handlePress}>
			<Layer
				beforeId={belowLayerId}
				id={mapOverlaySelectedStops_TopLayerId}
				type="symbol"
				style={{
					iconAllowOverlap: true,
					iconAnchor: 'bottom',
					iconIgnorePlacement: true,
					iconImage: 'stop-pole',
					iconOffset: [0, 5],
					iconOpacity: [
						'interpolate',
						['linear'],
						['zoom'],
						7, // min zoom level
						0, // min opacity
						10, // max zoom level
						1, // max opacity
					],
					iconSize: [
						'interpolate',
						['linear'],
						['zoom'],
						10, // min zoom level
						0.1, // min size
						20, // max zoom level
						0.25, // max size
					],
					symbolPlacement: 'point',
					visibility: selectedStopsData ? 'visible' : 'none',
				}}
			/>
			<Layer
				beforeId={mapOverlaySelectedStops_TopLayerId}
				id="selected-stops-circle-layer"
				type="circle"
				style={{
					circleColor: systemVariables.brand.cm,
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
					visibility: selectedStopsData ? 'visible' : 'none',
				}}
			/>
		</GeoJSONSource>
	);

	//
}

/* * */

export function transformSelectedStopDataIntoGeoJsonFeature(stopData: Stop): Feature<Point, MapOverlaySelectedStopsGeoJsonProperties> | undefined {
	// Validate input
	if (!stopData.lon) return;
	if (!stopData.lat) return;
	// Transform and return
	return {
		geometry: {
			coordinates: [stopData.lon, stopData.lat],
			type: 'Point',
		},
		properties: {
			_type: 'selected-stop',
			id: stopData.id,
		},
		type: 'Feature',
	};
}
