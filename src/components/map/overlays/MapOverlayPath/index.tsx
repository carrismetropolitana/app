/* * */

import { type HubStop, type HubWaypoint, type HubShape } from '@tmlmobilidade/go-types-public-info';

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { type Feature, type FeatureCollection, type LineString, type Point } from 'geojson';

/* * */

export const mapOverlayPath_TopLayerId = 'path-waypoints-layer';
export const mapOverlayPath_InteractiveLayerIds = [mapOverlayPath_TopLayerId];

/* * */

export interface MapOverlayPathShapeGeoJsonProperties {
	_type: 'path:shape'
	color?: string
	id: string
	text_color?: string
}

export interface MapOverlayPathWaypointGeoJsonProperties {
	_type: 'path:waypoint'
	color?: string
	id: string
	text_color?: string
}

/* * */

export interface MapOverlayPathProps {
	belowLayerId?: string
	shapeData?: FeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>
	waypointsData?: FeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties>
}

/* * */

export function MapOverlayPath({ belowLayerId, shapeData, waypointsData }: MapOverlayPathProps) {
	//

	//
	// A. Transform data

	const baseShapeFC = getBaseGeoJsonFeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>();
	const baseWaypointsFC = getBaseGeoJsonFeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties>();

	//
	// B. Render components

	return (
		<>

			<GeoJSONSource data={shapeData ?? baseShapeFC} id="path-shape-source">
				<Layer
					beforeId="path-shape-padding-layer"
					id="path-shape-shadow-layer"
					type="line"
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
				<Layer
					beforeId="path-shape-line-layer"
					id="path-shape-padding-layer"
					type="line"
					style={{
						lineCap: 'round',
						lineColor: '#FFFFFF',
						lineJoin: 'round',
						lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 26],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
				<Layer
					beforeId="path-shape-direction-layer"
					id="path-shape-line-layer"
					type="line"
					style={{
						lineCap: 'round',
						lineColor: ['get', 'color'],
						lineJoin: 'round',
						lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 12],
						visibility: shapeData ? 'visible' : 'none',
					}}
				/>
				<Layer
					beforeId={mapOverlayPath_TopLayerId}
					id="path-shape-direction-layer"
					type="symbol"
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
			</GeoJSONSource>

			<GeoJSONSource data={waypointsData ?? baseWaypointsFC} id="path-waypoints-source">
				<Layer
					beforeId={belowLayerId}
					id={mapOverlayPath_TopLayerId}
					type="circle"
					style={{
						circleColor: ['get', 'text_color'],
						circlePitchAlignment: 'map',
						circleRadius: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 15],
						circleStrokeColor: ['get', 'color'],
						circleStrokeWidth: ['interpolate', ['linear'], ['zoom'], 9, 1, 26, 7],
						visibility: waypointsData ? 'visible' : 'none',
					}}
				/>
			</GeoJSONSource>

		</>
	);

	//
}

/* * */

export function transformShapeDataIntoGeoJsonFeature(shapeData: HubShape, color?: string, textColor?: string): Feature<LineString, MapOverlayPathShapeGeoJsonProperties> | undefined {
	// Validate input
	if (!shapeData.geojson) return;
	// Transform and return
	return {
		...shapeData.geojson,
		properties: {
			_type: 'path:shape',
			color: color,
			id: shapeData._id,
			text_color: textColor,
		},
		type: 'Feature',
	};
}

export function transformWaypointDataIntoGeoJsonFeature(waypointData: undefined | HubWaypoint, stopData: HubStop | undefined, color?: string, textColor?: string): Feature<Point, MapOverlayPathWaypointGeoJsonProperties> | undefined {
	// Validate input
	if (!waypointData) return;
	if (!stopData) return;
	if (!stopData.longitude) return;
	if (!stopData.latitude) return;
	// Transform and return
	return {
		geometry: {
			coordinates: [stopData.longitude, stopData.latitude],
			type: 'Point',
		},
		properties: {
			_type: 'path:waypoint',
			color: color,
			id: waypointData.stop_id,
			text_color: textColor,
		},
		type: 'Feature',
	};
}
