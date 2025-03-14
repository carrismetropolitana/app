import { Camera, MapView } from '@maplibre/maplibre-react-native';

export function StyledMapView() {
	return (
		<MapView
			mapStyle="https://maps.carrismetropolitana.pt/styles/default/style.json"
			style={{ flex: 1 }}
		>
			{/* roughly amL :) */}
			<Camera centerCoordinate={[-9.0, 38.7]} zoomLevel={8.9} />
		</MapView>
	);
}
