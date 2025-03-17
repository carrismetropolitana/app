// /* * */

// import { MapViewToolbar } from '@/components/map/MapViewToolbar';
// import { useMapOptionsContext } from '@/contexts/MapOptions.context';
// import { useMap } from '@/hooks/useMap';
// import { IconsMap } from '@/settings/assets.settings';
// import { mapDefaultConfig } from '@/settings/map.settings';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { Camera, CircleLayer, MapView, ShapeSource } from '@maplibre/maplibre-react-native';
// import { useCallback, useState } from 'react';

// import styles from './styles.module.css';

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

// /* * */

// export type MapStyle = 'map' | 'satellite';

// interface Props {
// 	children: React.ReactNode
// 	fullscreen?: boolean
// 	geolocate?: boolean
// 	interactiveLayerIds?: string[]
// 	mapStyle?: MapStyle
// 	navigation?: boolean
// 	onCenterMap?: () => void
// 	onClick?: (arg0: Event) => void
// 	onMouseEnter?: (arg0: Event) => void
// 	onMouseLeave?: (arg0: Event) => void
// 	onMouseOut?: (arg0: Event) => void
// 	onMouseOver?: (arg0: Event) => void
// 	onMoveEnd?: (arg0: Event) => void
// 	onMoveStart?: (arg0: Event) => void
// 	scale?: boolean
// 	scrollZoom?: boolean
// 	toolbar?: boolean
// }

export function CustomMapView() {
	const vehicleContext = useVehiclesContext();
	const geojson = vehicleContext.actions.getAllVehiclesGeoJsonFC();

	return (
		<MapView
			mapStyle="https://maps.carrismetropolitana.pt/styles/default/style.json"
			style={{ flex: 1, height: '100%', width: '100%' }}
		>
			<Camera centerCoordinate={[-9.0, 38.7]} zoomLevel={8.9} />

			{geojson && (
				<ShapeSource id="vehicles" shape={geojson}>
					<CircleLayer
						id="vehicle-dots"
						style={{
							circleColor: '#FF0000',
							circleRadius: 2,
						}}
					/>
				</ShapeSource>
			)}
		</MapView>
	);
}
