import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import {
	CircleLayer,
	CircleLayerStyle,
	ShapeSource,
	SymbolLayer,
	SymbolLayerStyle,
} from '@maplibre/maplibre-react-native';
import React from 'react';

export interface MapViewStyleActiveStopsProps {
	stopsData?: GeoJSON.FeatureCollection<GeoJSON.Point, GeoJSON.GeoJsonProperties>
}

// SymbolLayer style for the stop pole icon
const poleStyle: SymbolLayerStyle = {
	iconAllowOverlap: true,
	iconAnchor: 'bottom',
	iconIgnorePlacement: true,
	iconImage: 'cmet-stop-selected',
	iconOffset: [0, 5] as any,
	iconOpacity: ['interpolate', ['linear'], ['zoom'], 7, 0, 10, 1] as any,
	iconSize: ['interpolate', ['linear'], ['zoom'], 10, 0.1, 20, 0.25] as any,
	symbolPlacement: 'point',
};

// CircleLayer style for the highlight circle
const circleStyle: CircleLayerStyle = {
	circleColor: ['match', ['get', 'current_status'], 'inactive', '#e6e6e6', '#ffdd01'] as any,
	circlePitchAlignment: 'map',
	circleRadius: ['interpolate', ['linear'], ['zoom'], 9, 3, 26, 20] as any,
	circleStrokeColor: ['match', ['get', 'current_status'], 'inactive', '#e6e6e6', 'voided', '#cc5533', '#000000'] as any,
	circleStrokeWidth: ['interpolate', ['linear'], ['zoom'], 9, 0.01, 26, 7] as any,
};

export function MapViewStyleActiveStops({ stopsData = getBaseGeoJsonFeatureCollection() }: MapViewStyleActiveStopsProps) {
	if (stopsData && stopsData.type !== 'FeatureCollection' && stopsData.type !== 'Feature') {
		throw new Error('stopsData must be a GeoJSON FeatureCollection');
	}

	return (
		<ShapeSource id="active-stops-source" shape={stopsData}>
			<SymbolLayer
				id="active-stops-pole-layer"
				style={poleStyle}
			/>
			<CircleLayer
				id="active-stops-circle-layer"
				style={circleStyle}
			/>
		</ShapeSource>
	);
}
