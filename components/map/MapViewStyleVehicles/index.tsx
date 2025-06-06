/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { NoVehicleIcon } from '@/components/common/NoVehicleIcon';
import { ShapeSource, SymbolLayer } from '@maplibre/maplibre-react-native';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export const MapViewStyleVehiclesPrimaryLayerId = 'default-layer-vehicles-regular';
export const MapViewStyleVehiclesInteractiveLayerId = 'default-layer-vehicles-regular';

/* * */

interface Props {
	onVehiclePress: (id: string) => void
	presentBeforeId?: string
	showCounter?: 'always' | 'positive'
	vehiclesCount?: number
	vehiclesData?: GeoJSON.FeatureCollection
}

/* * */

export function MapViewStyleVehicles({ onVehiclePress, showCounter, vehiclesCount = 0, vehiclesData }: Props) {
	//
	const counterStyles = styles();
	console.log(vehiclesCount);

	return (
		<>
			<ShapeSource
				id="default-source-vehicles"
				shape={vehiclesData}
				onPress={(e) => {
					const id = e.features?.[0]?.properties?.id || 0;
					onVehiclePress(id);
				}}
			>
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
						iconRotate: ['coalesce', ['get', 'bearing'], 0],
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

			{/* {
				(vehiclesCount === 0 && showCounter) && (
					<View style={counterStyles.zeroCount}>
						<NoVehicleIcon />
						<Text style={counterStyles.textMuted}>Sem veiculos em circulação</Text>
					</View>
				)
			}

			{ (vehiclesCount > 0 && (showCounter === 'always' || showCounter === 'positive')) && (
				(
					<View style={counterStyles.vehiclesCounter}>
						<LiveIcon />
						<Text style={counterStyles.text}>{vehiclesCount} veículos em circulação</Text>
					</View>
				)
			)} */}
		</>
	);
}
