/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export const MapViewStyleVehiclesPrimaryLayerId = 'default-layer-vehicles-regular';
export const MapViewStyleVehiclesInteractiveLayerId = 'default-layer-vehicles-regular';

/* * */

interface Props {
	presentBeforeId?: string
	showCounter?: 'always' | 'positive'
	vehiclesData?: GeoJSON.FeatureCollection
	onVehiclePress?: (vehicleId: string) => void
}

/* * */

const baseGeoJsonFeatureCollection = getBaseGeoJsonFeatureCollection();

/* * */

export function MapViewStyleVehicles({ showCounter, vehiclesData = baseGeoJsonFeatureCollection, onVehiclePress }: Props) {
	//
	// A. Setup variables

	const counterStyles = styles();

	//
	// B. Render components

	return (
		<>
			<ShapeSource id="default-source-vehicles" shape={vehiclesData}
			onPress={(e) => {
				const feature = e.features?.[0];
				if (feature && onVehiclePress) {
					onVehiclePress(feature.properties?.id ?? '');
				}
			}}>
				<SymbolLayer
					id="default-layer-vehicles-delay"
					sourceID="default-source-vehicles"
					style={{
						iconAllowOverlap: true,
						iconAnchor: 'center',
						iconIgnorePlacement: true,
						iconImage: 'cmet-bus-delay',
						iconOffset: [0, 0],
						iconOpacity: [
							'interpolate',
							['linear'],
							['get', 'delay'],
							20,
							0,
							40,
							1,
						],
						iconRotate: ['get', 'bearing'],
						iconRotationAlignment: 'map',
						iconSize: [
							'interpolate',
							['linear'],
							['zoom'],
							10,
							0.15,
							20,
							0.35,
						],
						symbolPlacement: 'point',
					}}
				/>

				<SymbolLayer
					id="default-layer-vehicles-regular"
					sourceID="default-source-vehicles"
					style={{
						iconAllowOverlap: true,
						iconAnchor: 'center',
						iconIgnorePlacement: true,
						iconImage: 'cmet-bus-regular',
						iconOffset: [0, 0],
						iconRotate: ['get', 'bearing'],
						iconRotationAlignment: 'map',
						iconSize: [
							'interpolate',
							['linear'],
							['zoom'],
							10,
							0.15,
							20,
							0.35,
						],
						symbolPlacement: 'point',
					}}
				/>
			</ShapeSource>

			{showCounter === 'always' && (

				<View style={vehiclesData.features.length !== 0 ? counterStyles.vehiclesCounter : counterStyles.zeroCount}>
					<LiveIcon />
					<Text style={counterStyles.text}>
						{vehiclesData.features.length} veículos em circulação
					</Text>
				</View>
			)}

			{showCounter === 'positive' && vehiclesData.features.length > 0 && (
				<View style={vehiclesData.features.length !== 0 ? counterStyles.vehiclesCounter : counterStyles.zeroCount}>
					<LiveIcon />
					<Text style={counterStyles.text}> {vehiclesData.features.length} veículos em circulação </Text>
				</View>
			)}
		</>
	);
}
