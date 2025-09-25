/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type CircleLayerStyle } from '@maplibre/maplibre-react-native';
import { CircleLayer, ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { GeoJsonProperties, Point } from 'geojson';

/* * */

export const MapViewStyleStopsPrimaryLayerId = 'default-layer-stops-all';
export const MapViewStyleStopsInteractiveLayerId = 'default-layer-stops-all-muted';

const primaryPaint = {
	circleColor: ['match', ['get', 'current_status'], 'inactive', '#e6e6e6', '#ffdd01'] as const,
	circlePitchAlignment: 'map',
	circleRadius: [
		'interpolate',
		['linear'],
		['zoom'],
		9,
		['case', ['boolean', ['feature-state', 'active'], false], 8, 3],
		26,
		['case', ['boolean', ['feature-state', 'active'], false], 32, 26],
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
		2,
		26,
		16,
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

/* * */

interface MapOverlaySelectedStopProps {
	flaggedStopId?: string
	onStopPress?: (stopId: string) => void
	presentBeforeId?: string
	stopsData?: GeoJSON.FeatureCollection
	style?: 'muted' | 'primary'
}

/* * */

export function MapOverlaySelectedStop({ flaggedStopId, onStopPress, stopsData, style = 'primary' }: MapOverlaySelectedStopProps) {
	//

	//
	// A. Setup variables

	const baseStopsFC = getBaseGeoJsonFeatureCollection<Point, GeoJsonProperties>();

	const layerId = style === 'primary' ? MapViewStyleStopsPrimaryLayerId : MapViewStyleStopsInteractiveLayerId;
	const paintStyle = style === 'primary' ? primaryPaint : mutedPaint;
	const flaggedFeature = flaggedStopId && stopsData.features ? stopsData.features.find(f => f.properties && f.properties.id == flaggedStopId) : undefined;
	const flaggedGeoJson = flaggedFeature
		? { features: [flaggedFeature], type: 'FeatureCollection' as const }
		: null;

	//
	// B. Return view

	return (
		<>
			<ShapeSource
				id="default-source-stops-all"
				shape={stopsData}
				onPress={(e) => {
					const feature = e.features?.[0];
					if (feature && onStopPress) {
						const stopId = feature.properties?.id ?? '';
						if (flaggedStopId === stopId) {
							onStopPress('');
						}
						else {
							onStopPress(stopId);
						}
					}
				}}
			>
				<CircleLayer id={layerId} style={paintStyle} />
			</ShapeSource>
			{flaggedGeoJson && (
				<ShapeSource id="flagged-stop-source" shape={flaggedGeoJson}>
					<SymbolLayer
						id="flagged-stop-flag"
						style={{
							iconAnchor: 'bottom',
							iconImage: 'cmet-stop-selected',
							iconOffset: [0, -20],
							iconSize: 0.1,
						}}
					/>
				</ShapeSource>
			)}
		</>
	);
}
