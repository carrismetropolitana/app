/* * */

import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { GeoJSONSource, Layer, type PressEventWithFeatures } from '@maplibre/maplibre-react-native';
import { type HubVehiclePosition } from '@tmlmobilidade/go-types-public-info';
import { type Feature, type FeatureCollection, type Point } from 'geojson';
import { type NativeSyntheticEvent } from 'react-native';

/* * */

export const mapOverlayVehicles_TopLayerId = 'layer-vehicles-regular';
export const mapOverlayVehicles_InteractiveLayerIds = [mapOverlayVehicles_TopLayerId, 'layer-vehicles-delay'];

/* * */

export interface MapOverlayVehiclesGeoJsonProperties {
	_type: 'vehicle'
	bearing?: number
	contactless?: boolean
	delay?: number
	id: string
}

/* * */

interface MapOverlayVehiclesProps {
	belowLayerId?: string
	onVehiclePress?: (id: string) => void
	vehiclesDataFC?: FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>
}

/* * */

export function MapOverlayVehicles({ belowLayerId, onVehiclePress, vehiclesDataFC }: MapOverlayVehiclesProps) {
	//

	//
	// A. Transform data

	const baseVehiclesFC = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();

	//
	// A. Handle actions

	const handlePress = (e: NativeSyntheticEvent<PressEventWithFeatures>) => {
		const featureId = e.nativeEvent.features?.[0]?.properties?.id;
		if (!featureId || !onVehiclePress) return;
		onVehiclePress(featureId);
	};

	//
	// B. Render components

	return (
		<GeoJSONSource
			data={vehiclesDataFC ?? baseVehiclesFC}
			id="source-vehicles"
			onPress={handlePress}
		>
			<Layer
				beforeId={mapOverlayVehicles_TopLayerId}
				id="layer-vehicles-delay"
				type="symbol"
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
			<Layer
				beforeId={belowLayerId}
				id={mapOverlayVehicles_TopLayerId}
				type="symbol"
				style={{
					iconAllowOverlap: true,
					iconAnchor: 'center',
					iconIgnorePlacement: true,
					iconImage: [
						'match',
						['to-string', ['get', 'contactless']],
						'true',
						'bus-cut',
						'bus-regular',
					],
					iconOffset: [0, 0],
					iconRotate: ['coalesce', ['get', 'bearing'], 0],
					iconRotationAlignment: 'map',
					iconSize: [
						'interpolate',
						['linear'],
						['zoom'],
						10, ['match', ['to-string', ['get', 'contactless']], 'true', 0.09, 0.07],
						20, ['match', ['to-string', ['get', 'contactless']], 'true', 0.3, 0.15],
					],
					symbolPlacement: 'point',
				}}
			/>
		</GeoJSONSource>
	);

	//
}

/* * */

export function transformVehicleDataIntoGeoJsonFeature(vehicleData: HubVehiclePosition, contactless = false): Feature<Point, MapOverlayVehiclesGeoJsonProperties> | undefined {
	// Validate input
	if (!Number.isFinite(vehicleData.longitude)) return;
	if (!Number.isFinite(vehicleData.latitude)) return;
	// Transform and return
	return {
		geometry: {
			coordinates: [vehicleData.longitude, vehicleData.latitude],
			type: 'Point',
		},
		properties: {
			_type: 'vehicle',
			bearing: vehicleData.bearing ?? undefined,
			contactless,
			delay: Math.floor((Date.now() - (vehicleData.received_at || 0)) / 1000),
			id: vehicleData.vehicle_id,
		},
		type: 'Feature',
	};
}
