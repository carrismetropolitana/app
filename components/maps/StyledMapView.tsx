import { Camera, MapView } from "@maplibre/maplibre-react-native";

// interface StyledMapViewProps {

// }

export function StyledMapView() {
	return (
		<MapView
			style={{ flex: 1 }}
			mapStyle="https://maps.carrismetropolitana.pt/styles/default/style.json"
		>
			{/* roughly amL :) */}
			<Camera zoomLevel={8.9} centerCoordinate={[-9.0, 38.7]} />
		</MapView>
	);
}
