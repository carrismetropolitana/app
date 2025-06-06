/* * */

import { mapDefaultValues } from '@/settings/map.settings';
import * as turf from '@turf/turf';
import { Dimensions } from 'react-native';

/* * */

interface CenterMapOptions {
	padding: number
}

/**
 *
 * @param mapObject The map that should be manipulated
 * @param features The features to center the map on
 * @param options Optional settings to customize the centering
 */
export const centerMap = (mapObject, features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[], options?: CenterMapOptions) => {
	//

	//
	// Validate input parameters

	if (!mapObject) return;
	if (!features.length) return;

	//
	// Create a feature collection from the given features, and get the corresponding envelope.
	// Return if the envelope is not valid.

	const featureCollection = turf.featureCollection(features);
	const envelope = turf.envelope(featureCollection);
	if (!envelope || !envelope.bbox) return;

	const [minLon, minLat, maxLon, maxLat] = envelope.bbox;
	const center = [
		(minLon + maxLon) / 2,
		(minLat + maxLat) / 2,
	];

	if (typeof mapObject.moveTo === 'function') {
		mapObject.moveTo(center, 1000);
	}
};

/* * */

/**
 *
 * @param mapObject THe map that should be manipulated
 * @param coordinates The destination coordinates to move the map to
 * @param options Optional settings to customize the movement
 */
export const moveMap = (mapObject, coordinates: GeoJSON.Position) => {
	//

	//
	// Validate the input parameters

	if (!mapObject) return;
	if (!coordinates || !coordinates.length) return;

	//
	// Get map current zoom level

	const currentZoom = mapObject.getZoom();
	const currentZoomWithMargin = currentZoom + mapDefaultValues.zoom_margin;
	const thresholdZoomWithMargin = mapDefaultValues.zoom + mapDefaultValues.zoom_margin;

	//
	// Check if the given coordinates are inside the currently rendered map bounds

	const currentMapBounds: [[number, number], [number, number]] = mapObject.getBounds().toArray();
	const isInside = turf.booleanIntersects(turf.point(coordinates), turf.bboxPolygon([...currentMapBounds[0], ...currentMapBounds[1]]));

	//
	// If the given coordinates are visible and the zoom is not too far back (plus a little margin)...

	if (isInside && currentZoomWithMargin > (thresholdZoomWithMargin * 1.15)) {
		// ...then simply ease to it.
		mapObject.easeTo({ center: coordinates, duration: mapDefaultValues.speed * 0.25, zoom: currentZoom });
	}
	else {
		// If the zoom is too far, or the given coordinates are not visible, then fly to it
		mapObject.flyTo({ center: coordinates, duration: mapDefaultValues.speed, zoom: thresholdZoomWithMargin });
	}

	//
};

/* * */

/**
 * Return a base GeoJSON Feature for LineString object
 * @returns A GeoJSON Feature for LineString object with an empty features array
 */

export const getBaseGeoJsonFeatureLineString = (): GeoJSON.Feature => {
	return { geometry: { coordinates: [], type: 'LineString' }, properties: {}, type: 'Feature' };
};

/**
 * Return a base GeoJSON FeatureCollection object
 * @returns A GeoJSON FeatureCollection object with an empty features array
 */

export const getBaseGeoJsonFeatureCollection = (): GeoJSON.FeatureCollection<GeoJSON.Point, GeoJSON.GeoJsonProperties> => {
	return { features: [], type: 'FeatureCollection' };
};

/**
 * Get the center and zoom level for the given features
 * @param features The features to calculate the center and zoom for
 * @param padding Optional padding for the zoom level (default: 0.5)
 * @returns The center coordinates and zoom level, or null if features are empty
 */

export function getCenterAndZoom(features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[], padding = 1.4): null | { center: [number, number], zoom: number } {
	if (!features.length) return null;

	const featureCollection = turf.featureCollection(features);
	const envelope = turf.envelope(featureCollection);
	if (!envelope || !envelope.bbox) return null;

	const [minLon, minLat, maxLon, maxLat] = envelope.bbox;
	const center: [number, number] = [
		(minLon + maxLon) / 2,
		(minLat + maxLat) / 2,
	];

	const { height, width } = Dimensions.get('window');

	function latRad(lat: number) {
		const sin = Math.sin((lat * Math.PI) / 180);
		const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	function zoom(mapPx: number, worldPx: number, fraction: number) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

	const WORLD_DIM = { height: 256, width: 256 };
	const ZOOM_MAX = 20;
	const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
	const lngDiff = maxLon - minLon;
	const lngFraction = ((lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360);
	const latZoom = zoom(height, WORLD_DIM.height, latFraction);
	const lngZoom = zoom(width, WORLD_DIM.width, lngFraction);
	const zoomLevel = Math.min(latZoom, lngZoom, ZOOM_MAX) - padding;

	return { center, zoom: zoomLevel };
}
