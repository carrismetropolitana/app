/* * */

import { type Feature, type FeatureCollection, type Geometry } from 'geojson';

/**
 * Creates a base GeoJSON feature collection for the given feature type.
 * @returns A base GeoJSON feature collection with an empty features array.
 */
export function getBaseGeoJsonFeature<T extends Geometry, K>(type: T['type'], properties?: K): Feature<T, K> {
	const emptyGeometries: Record<Geometry['type'], Geometry> = {
		GeometryCollection: { geometries: [], type: 'GeometryCollection' },
		LineString: { coordinates: [], type: 'LineString' },
		MultiLineString: { coordinates: [], type: 'MultiLineString' },
		MultiPoint: { coordinates: [], type: 'MultiPoint' },
		MultiPolygon: { coordinates: [], type: 'MultiPolygon' },
		Point: { coordinates: [0, 0], type: 'Point' },
		Polygon: { coordinates: [], type: 'Polygon' },
	};
	return {
		geometry: emptyGeometries[type] as T,
		properties: (properties ?? {}) as K,
		type: 'Feature',
	};
}

/**
 * Creates a base GeoJSON feature collection for the given feature type.
 * @returns A base GeoJSON feature collection with an empty features array.
 */
export function getBaseGeoJsonFeatureCollection<T extends Geometry, K>(): FeatureCollection<T, K> {
	return Object.assign({ features: [], type: 'FeatureCollection' });
};
