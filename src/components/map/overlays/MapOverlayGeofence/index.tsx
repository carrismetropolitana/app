/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { useSystemVariables } from '@/theme/global';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
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

	const systemVariables = useSystemVariables();

	const baseGeofenceFC = getBaseGeoJsonFeatureCollection<Polygon, MapOverlayGeofenceShapeGeoJsonProperties>();

	//
	// B. Render components

	return (
		<GeoJSONSource data={geofenceData ?? baseGeofenceFC} id="geofence-source">
			<Layer
				beforeId={mapOverlayGeofence_TopLayerId}
				id="geofence-fill-layer"
				type="fill"
				style={{
					fillColor: systemVariables.status.active,
					fillOpacity: 0.25,
					visibility: geofenceData ? 'visible' : 'none',
				}}
			/>
			<Layer
				beforeId={belowLayerId}
				id={mapOverlayGeofence_TopLayerId}
				type="line"
				style={{
					lineCap: 'round',
					lineColor: systemVariables.status.active,
					lineJoin: 'round',
					lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 1, 20, 10],
					visibility: geofenceData ? 'visible' : 'none',
				}}
			/>
		</GeoJSONSource>
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
