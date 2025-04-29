// /* * */

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { Camera, CircleLayer, LineLayer, MapView, ShapeSource } from '@maplibre/maplibre-react-native';

// /* * */

// const MAP_LOAD_ASSETS = [
// 	{ name: 'cmet-bus-delay', sdf: false, url: IconsMap.bus_delay },
// 	{ name: 'cmet-bus-regular', sdf: false, url: IconsMap.bus_regular },
// 	{ name: 'cmet-bus-error', sdf: false, url: IconsMap.bus_error },
// 	{ name: 'cmet-pin', sdf: false, url: IconsMap.pin },
// 	{ name: 'cmet-shape-direction', sdf: true, url: IconsMap.shape_direction },
// 	{ name: 'cmet-stop-selected', sdf: false, url: IconsMap.stop_selected },
// 	{ name: 'cmet-store-busy', sdf: false, url: IconsMap.store_busy },
// 	{ name: 'cmet-store-closed', sdf: false, url: IconsMap.store_closed },
// 	{ name: 'cmet-store-open', sdf: false, url: IconsMap.store_open },
// ];

export function CustomMapView() {
	const vehicleContext = useVehiclesContext();
	const lineDetailsContext = useLinesDetailContext();
	const stopDetailsContext = useStopsDetailContext();

	const pathgeojson = lineDetailsContext.data.active_shape?.geojson;
	const stopgeojson = stopDetailsContext.data.active_shape?.geojson;
	const vehiclegeojson = vehicleContext.actions.getVehiclesByPatternIdGeoJsonFC(lineDetailsContext.data.active_pattern?.id || '');

	return (
	// <MapView
	// 	logoEnabled={false}
	// 	mapStyle="https://maps.carrismetropolitana.pt/styles/default/style.json"
	// 	style={{ height: '100%', width: '100%' }}

	// >
	// 	<Camera centerCoordinate={[-9.0, 38.7]} zoomLevel={8.9} />

	// 	{geojson && (
	// 		<ShapeSource id="vehicles" shape={geojson}>
	// 			<CircleLayer
	// 				id="vehicle-dots"
	// 				style={{
	// 					circleColor: '#FF0000',
	// 					circleRadius: 2,
	// 				}}
	// 			/>
	// 		</ShapeSource>
	// 	)}
	// </MapView>

		<MapView
			logoEnabled={false}
			mapStyle="https://maps.carrismetropolitana.pt/styles/default/style.json"
			style={{ height: '100%', width: '100%' }}

		>
			<Camera centerCoordinate={[-9.0, 38.7]} zoomLevel={8.9} />

			{pathgeojson && (
				<>
					<ShapeSource id="line-path" shape={pathgeojson}>
						<LineLayer
							id="line-path-line"
							style={{
								lineColor: pathgeojson.properties?.color,
								lineWidth: 5,
							}}
						/>
					</ShapeSource>

					{stopgeojson && (
						<ShapeSource id="stops" shape={stopgeojson}>
							<CircleLayer
								id="stops-dots"
								style={{
									circleColor: stopgeojson.properties?.color,
									circleRadius: 2,
									circleStrokeWidth: 1,
								}}
							/>
						</ShapeSource>
					)}

					{ vehiclegeojson && (
						<ShapeSource id="vehicles" shape={vehiclegeojson}>
							<CircleLayer
								id="vehicle-dots"
								style={{
									circleColor: 'green',
									circleRadius: 4,
									circleStrokeWidth: 1,
								}}
							/>
						</ShapeSource>
					)}

				</>
			)}

		</MapView>
	);
}
