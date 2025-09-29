/* * */

import { VehiclesCounter } from '@/components/common/VehiclesCounter';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { OnPressEvent, ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { type Feature, type FeatureCollection, type Point } from 'geojson';
import { View } from 'react-native';
import { Platform } from 'react-native';

import { useStyles } from './styles';

/* * */

export const mapOverlayVehicles_TopLayerId = 'layer-vehicles-regular';
export const mapOverlayVehicles_InteractiveLayerIds = [mapOverlayVehicles_TopLayerId, 'layer-vehicles-delay'];

/* * */

export interface MapOverlayVehiclesGeoJsonProperties {
	_type: 'vehicle'
	bearing?: number
	delay?: number
	id: string
}

/* * */

interface MapOverlayVehiclesProps {
	belowLayerId?: string
	onVehiclePress?: (id: string) => void
	vehiclesDataFC?: FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>
	withVehiclesCounter?: boolean
}

/* * */

export function MapOverlayVehicles({ belowLayerId, onVehiclePress, vehiclesDataFC, withVehiclesCounter }: MapOverlayVehiclesProps) {
	//

	//
	// A. Transform data

	const styles = useStyles();

	const baseVehiclesFC = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();

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
		<>

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

			{/* * */}
			{/* Children views not supported on Android. */}
			{/* See: https://github.com/maplibre/maplibre-react-native/issues/967 */}

			{withVehiclesCounter && Platform.OS === 'ios' && (
				<View style={styles.counterWrapper}>
					<VehiclesCounter qty={vehiclesDataFC?.features.length} visibleIfZero />
				</View>
			)}

		</>
	);

	//
}

/* * */

export function transformVehicleDataIntoGeoJsonFeature(vehicleData: Vehicle): Feature<Point, MapOverlayVehiclesGeoJsonProperties> | undefined {
	// Validate input
	if (!vehicleData.lon) return;
	if (!vehicleData.lat) return;
	// Transform and return
	return {
		geometry: {
			coordinates: [vehicleData.lon, vehicleData.lat],
			type: 'Point',
		},
		properties: {
			_type: 'vehicle',
			bearing: vehicleData.bearing,
			delay: Math.floor(Date.now() / 1000) - (vehicleData.timestamp || 0),
			id: vehicleData.id,
		},
		type: 'Feature',
	};
}
