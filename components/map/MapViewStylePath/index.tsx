import {
	CircleLayer,
	CircleLayerStyle,
	LineLayer,
	LineLayerStyle,
	ShapeSource,
	SymbolLayer,
	SymbolLayerStyle,
} from '@maplibre/maplibre-react-native';
import React from 'react';

export interface MapViewStylePathProps {
	shapeData?: GeoJSON.Feature | GeoJSON.FeatureCollection
	waypointsData?: GeoJSON.FeatureCollection
}

export const INTERACTIVE_LAYER_ID = 'path-waypoints-layer';

const waypointStyle: CircleLayerStyle = {
	circleColor: ['get', 'text_color'],
	circlePitchAlignment: 'map',
	circleRadius: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 15],
	circleStrokeColor: ['get', 'color'],
	circleStrokeWidth: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 7],
};

const shapeDirectionStyle: SymbolLayerStyle = {
	iconAllowOverlap: true,
	iconAnchor: 'center',
	iconColor: '#ffffff',
	iconIgnorePlacement: true,
	iconImage: 'cmet-shape-direction',
	iconOffset: [0, 0],
	iconOpacity: 0.8,
	iconRotate: 90,
	iconSize: ['interpolate', ['linear'], ['zoom'], 10, 0.1, 20, 0.2],
	symbolPlacement: 'line',
	symbolSpacing: ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
};

const shapeLineStyle: LineLayerStyle = {
	lineCap: 'round',
	lineColor: ['get', 'color'],
	lineJoin: 'round',
	lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
};

const shapePaddingStyle: LineLayerStyle = {
	lineCap: 'round',
	lineColor: '#FFFFFF',
	lineJoin: 'round',
	lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 26],
};

const shapeShadowStyle: LineLayerStyle = {
	lineBlur: 15,
	lineCap: 'round',
	lineColor: '#000000',
	lineJoin: 'round',
	lineOpacity: 0.3,
	lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 40],
};

export function MapViewStylePath({ shapeData = { features: [], type: 'FeatureCollection' }, waypointsData = { features: [], type: 'FeatureCollection' } }: MapViewStylePathProps) {
	return (
		<>
			<ShapeSource id="path-shape-source" shape={(shapeData).type === 'Feature' ? { features: [shapeData], type: 'FeatureCollection' } : shapeData}>
				<LineLayer id="path-shape-padding-layer" style={shapePaddingStyle} />
				<LineLayer id="path-shape-shadow-layer" style={shapeShadowStyle} />
				<LineLayer id="path-shape-line-layer" style={shapeLineStyle} />
				<SymbolLayer id="path-shape-direction-layer" style={shapeDirectionStyle} />

			</ShapeSource>
			<ShapeSource id="path-waypoints-source" shape={waypointsData}>
				<CircleLayer id={INTERACTIVE_LAYER_ID} style={waypointStyle} />
			</ShapeSource>

		</>
	);
}
