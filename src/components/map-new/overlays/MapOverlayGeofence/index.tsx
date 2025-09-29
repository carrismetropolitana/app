/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { FillLayer, LineLayer, ShapeSource } from '@maplibre/maplibre-react-native';
import { type Feature, type Polygon } from 'geojson';

/* * */

export const mapOverlayGeofence_TopLayerId = 'geofence-line-layer';
export const mapOverlayGeofence_InteractiveLayerIds = [mapOverlayGeofence_TopLayerId];

/* * */

export interface MapOverlayGeofenceShapeGeoJsonProperties {
	_type: 'geofence'
	color?: string
}

/* * */

export interface MapOverlayGeofenceProps {
	belowLayerId?: string
	geofenceData?: Feature<Polygon, MapOverlayGeofenceShapeGeoJsonProperties>
}

/* * */

export function MapOverlayGeofence({ belowLayerId, geofenceData }: MapOverlayGeofenceProps) {
	//

	//
	// A. Transform data

	const baseGeofenceFC = getBaseGeoJsonFeatureCollection<Polygon, MapOverlayGeofenceShapeGeoJsonProperties>();

	//
	// B. Render components

	return (
		<ShapeSource id="geofence-source" shape={geofenceData ?? baseGeofenceFC}>
			<FillLayer
				belowLayerID={mapOverlayGeofence_TopLayerId}
				id="geofence-fill-layer"
				style={{
					fillColor: '#ff0000',
					fillOpacity: 0.15,
					visibility: geofenceData ? 'visible' : 'none',
				}}
			/>
			<LineLayer
				belowLayerID={belowLayerId}
				id={mapOverlayGeofence_TopLayerId}
				style={{
					lineCap: 'round',
					lineColor: '#ff0000',
					lineJoin: 'round',
					lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 4, 20, 1],
					visibility: geofenceData ? 'visible' : 'none',
				}}
			/>
		</ShapeSource>
	);

	//
}

/* * */

export function transformShapeDataIntoGeoJsonFeature(geofenceData: Feature<Polygon>, color?: string): Feature<Polygon, MapOverlayGeofenceShapeGeoJsonProperties> | undefined {
	// Validate input
	if (!geofenceData) return;
	// Transform and return
	return {
		...geofenceData,
		properties: {
			_type: 'geofence',
			color: color,
		},
		type: 'Feature',
	};
}
