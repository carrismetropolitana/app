import type { CircleLayerStyle } from '@maplibre/maplibre-react-native';

import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { CircleLayer, ShapeSource } from '@maplibre/maplibre-react-native';
import React from 'react';

export const MapViewStyleStopsPrimaryLayerId = 'default-layer-stops-all';
export const MapViewStyleStopsInteractiveLayerId = 'default-layer-stops-all-muted';

interface Props {
	onStopPress?: (stopId: string) => void
	presentBeforeId?: string
	stopsData?: GeoJSON.FeatureCollection
	style?: 'muted' | 'primary'
}

const baseGeoJsonFeatureCollection = getBaseGeoJsonFeatureCollection();

const primaryPaint = {
	circleColor: ['match', ['get', 'current_status'], 'inactive', '#e6e6e6', '#ffdd01'] as const,
	circlePitchAlignment: 'map',
	circleRadius: [
		'interpolate',
		['linear'],
		['zoom'],
		9,
		['case', ['boolean', ['feature-state', 'active'], false], 5, 1],
		26,
		['case', ['boolean', ['feature-state', 'active'], false], 25, 20],
	] as const,
	circleStrokeColor: ['match', ['get', 'current_status'], 'inactive', '#969696', 'voided', '#cc5533', '#000000'] as const,
	circleStrokeWidth: [
		'interpolate',
		['linear'],
		['zoom'],
		9,
		0.01,
		26,
		['case', ['boolean', ['feature-state', 'active'], false], 8, 7],
	] as const,
} satisfies CircleLayerStyle;

const mutedPaint = {
	circleColor: ['match', ['get', 'current_status'], 'inactive', '#e6e6e6', '#ffdd01'] as const,
	circlePitchAlignment: 'map',
	circleRadius: [
		'interpolate',
		['linear'],
		['zoom'],
		9,
		1,
		26,
		10,
	] as const,
	circleStrokeColor: ['match', ['get', 'current_status'], 'inactive', '#969696', 'voided', '#cc5533', '#000000'] as const,
	circleStrokeWidth: [
		'interpolate',
		['linear'],
		['zoom'],
		9,
		0.01,
		26,
		3,
	] as const,
} satisfies CircleLayerStyle;

export function MapViewStyleStops({ onStopPress, stopsData = baseGeoJsonFeatureCollection, style = 'primary' }: Props) {
	const layerId = style === 'primary'
		? MapViewStyleStopsPrimaryLayerId
		: MapViewStyleStopsInteractiveLayerId;

	const paintStyle = style === 'primary' ? primaryPaint : mutedPaint;

	return (
		<ShapeSource
			id="default-source-stops-all"
			shape={stopsData}
			onPress={(e) => {
				const feature = e.features?.[0];
				if (feature && onStopPress) {
					onStopPress(feature.properties?.id ?? '');
				}
			}}
		>
			<CircleLayer id={layerId} style={paintStyle} />
		</ShapeSource>
	);
}
