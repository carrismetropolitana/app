/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { Stop } from '@carrismetropolitana/api-types/network';
import { CircleLayer, type OnPressEvent, ShapeSource } from '@maplibre/maplibre-react-native';
import { Feature, type FeatureCollection, type Point } from 'geojson';

/* * */

export const mapOverlayStops_TopLayerId = 'stops-circle-layer';
export const mapOverlayStops_InteractiveLayerIds = [mapOverlayStops_TopLayerId];

/* * */

interface MapOverlayStopsProps {
	belowLayerId?: string
	onSelectStop?: (stop: Stop) => void
	stopsData?: FeatureCollection<Point, Stop>
}

/* * */

export function MapOverlayStops({ belowLayerId, onSelectStop, stopsData }: MapOverlayStopsProps) {
	//

	//
	// A. Setup variables

	const baseStopsFC = getBaseGeoJsonFeatureCollection<Point, Stop>();

	//
	// B. Handle actions

	const handlePress = (event: OnPressEvent) => {
		// Skip if no callback
		if (!onSelectStop) return;
		// Get feature and call callback
		const matchingFeature = event.features.find(f => f.properties?.id) as Feature<Point, Stop> | undefined;
		if (matchingFeature) onSelectStop(matchingFeature.properties);
	};

	//
	// C. Render components

	return (
		<ShapeSource id="source-stops-all" onPress={handlePress} shape={stopsData ?? baseStopsFC}>
			<CircleLayer
				belowLayerID={belowLayerId}
				id={mapOverlayStops_TopLayerId}
				style={{
					circleColor: [
						'match',
						['get', 'current_status'],
						'inactive', '#e6e6e6', '#ffdd01',
					],
					circlePitchAlignment: 'map',
					circleRadius: [
						'interpolate',
						['linear'],
						['zoom'],
						9, // min zoom level
						1, // min radius
						26, // max zoom level
						22, // max radius
					],
					circleStrokeColor: [
						'match',
						['get', 'current_status'],
						'inactive', '#969696',
						'voided', '#cc5533',
						'#000000', // default
					],
					circleStrokeWidth: [
						'interpolate',
						['linear'],
						['zoom'],
						9, // min zoom level
						0.01, // min width
						26, // max zoom level
						4, // max width
					],
					visibility: stopsData ? 'visible' : 'none',
				}}
			/>
		</ShapeSource>
	);

	//
}
