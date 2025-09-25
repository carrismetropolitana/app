/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { CircleLayer, LineLayer, ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { type FeatureCollection, type GeoJsonProperties, type LineString, type Point } from 'geojson';

/* * */

export const mapOverlayPath_TopLayerId = 'path-waypoints-layer';
export const mapOverlayPath_InteractiveLayerIds = [mapOverlayPath_TopLayerId];

/* * */

export interface MapOverlayPathProps {
	belowLayerId?: string
	shapeData?: FeatureCollection<LineString>
	waypointsData?: FeatureCollection<Point>
}

/* * */

export function MapOverlayPath({ belowLayerId, shapeData, waypointsData }: MapOverlayPathProps) {
	//

	//
	// A. Transform data

	const baseShapeFC = getBaseGeoJsonFeatureCollection<LineString, GeoJsonProperties>();
	const baseWaypointsFC = getBaseGeoJsonFeatureCollection<Point, GeoJsonProperties>();

	//
	// B. Render components

	return (
		<>

			<ShapeSource id="path-shape-source" shape={shapeData ?? baseShapeFC}>
				<LineLayer
					belowLayerID="path-shape-padding-layer"
					id="path-shape-shadow-layer"
					style={{
						lineBlur: 15,
						lineCap: 'round',
						lineColor: '#000000',
						lineJoin: 'round',
						lineOpacity: 0.3,
						lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 40],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
				<LineLayer
					belowLayerID="path-shape-line-layer"
					id="path-shape-padding-layer"
					style={{
						lineCap: 'round',
						lineColor: '#FFFFFF',
						lineJoin: 'round',
						lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 26],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
				<LineLayer
					belowLayerID="path-shape-direction-layer"
					id="path-shape-line-layer"
					style={{
						lineCap: 'round',
						lineColor: ['get', 'color'],
						lineJoin: 'round',
						lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
				<SymbolLayer
					belowLayerID={mapOverlayPath_TopLayerId}
					id="path-shape-direction-layer"
					style={{
						iconAllowOverlap: true,
						iconAnchor: 'center',
						iconIgnorePlacement: true,
						iconImage: 'shape-direction',
						iconOffset: [0, 0],
						iconOpacity: 0.8,
						iconRotate: 90,
						iconSize: ['interpolate', ['linear'], ['zoom'], 10, 0.1, 20, 0.2],
						symbolPlacement: 'line',
						symbolSpacing: ['interpolate', ['linear'], ['zoom'], 10, 2, 20, 30],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
			</ShapeSource>

			<ShapeSource id="path-waypoints-source" shape={waypointsData ?? baseWaypointsFC}>
				<CircleLayer
					belowLayerID={belowLayerId}
					id={mapOverlayPath_TopLayerId}
					style={{
						circleColor: ['get', 'text_color'],
						circlePitchAlignment: 'map',
						circleRadius: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 15],
						circleStrokeColor: ['get', 'color'],
						circleStrokeWidth: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 7],
						visibility: waypointsData ? 'visible' : 'none',
					}}
				/>
			</ShapeSource>

		</>
	);

	//
}
