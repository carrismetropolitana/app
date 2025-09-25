/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { OnPressEvent, ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { type FeatureCollection, type GeoJsonProperties, type Point } from 'geojson';

/* * */

export const mapOverlayVehicles_TopLayerId = 'layer-vehicles-regular';
export const mapOverlayVehicles_InteractiveLayerIds = [mapOverlayVehicles_TopLayerId, 'layer-vehicles-delay'];

/* * */

interface MapOverlayVehiclesProps {
	belowLayerId?: string
	onVehiclePress?: (id: string) => void
	vehiclesDataFC?: FeatureCollection<Point, GeoJsonProperties>
}

/* * */

export function MapOverlayVehicles({ belowLayerId, onVehiclePress, vehiclesDataFC }: MapOverlayVehiclesProps) {
	//

	//
	// A. Transform data

	const baseVehiclesFC = getBaseGeoJsonFeatureCollection<Point, GeoJsonProperties>();

	//
	// A. Handle actions

	const handlePress = (e: OnPressEvent) => {
		const featureId = e.features?.[0]?.properties?.id;
		if (!featureId || !onVehiclePress) return;
		onVehiclePress(featureId);
	};

	//
	// B. Render components

	return (
		<ShapeSource
			id="source-vehicles"
			onPress={handlePress}
			shape={vehiclesDataFC ?? baseVehiclesFC}
		>
			<SymbolLayer
				belowLayerID={mapOverlayVehicles_TopLayerId}
				id="layer-vehicles-delay"
				style={{
					iconAllowOverlap: true,
					iconAnchor: 'center',
					iconIgnorePlacement: true,
					iconImage: 'bus-delay',
					iconOffset: [0, 0],
					iconOpacity: [
						'interpolate',
						['linear'],
						['coalesce', ['get', 'delay'], 0],
						20,
						0,
						40,
						1,
					],
					iconRotate: ['coalesce', ['get', 'bearing'], 0],
					iconRotationAlignment: 'map',
					iconSize: [
						'interpolate',
						['linear'],
						['zoom'],
						10,
						0.07,
						20,
						0.15,
					],
					symbolPlacement: 'point',
				}}
			/>
			<SymbolLayer
				belowLayerID={belowLayerId}
				id={mapOverlayVehicles_TopLayerId}
				style={{
					iconAllowOverlap: true,
					iconAnchor: 'center',
					iconIgnorePlacement: true,
					iconImage: 'bus-regular',
					iconOffset: [0, 0],
					iconRotate: ['coalesce', ['get', 'bearing'], 0],
					iconRotationAlignment: 'map',
					iconSize: [
						'interpolate',
						['linear'],
						['zoom'],
						10,
						0.07,
						20,
						0.15,
					],
					symbolPlacement: 'point',
				}}
			/>
		</ShapeSource>
	);

	//
}
