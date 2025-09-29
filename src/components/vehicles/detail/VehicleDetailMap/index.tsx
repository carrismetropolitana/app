/* * */

import { MapOverlayPath } from '@/components/map-new/overlays/MapOverlayPath';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map-new/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map-new/view/MapView';
import { useVehicleDetailContext } from '@/contexts/VehicleDetail.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function VehicleDetailMap() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const vehicleDetailContext = useVehicleDetailContext();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<MapView
				vehiclesCounterQty={vehicleDetailContext.data.vehicle_fc?.features.length ?? 0}
				withUserLocation
			>
				<MapOverlayPath
					belowLayerId={mapOverlayVehicles_TopLayerId}
					shapeData={vehicleDetailContext.data.shape_fc}
					waypointsData={vehicleDetailContext.data.waypoints_fc}
				/>
				<MapOverlayVehicles
					vehiclesDataFC={vehicleDetailContext.data.vehicle_fc}
				/>
			</MapView>
		</View>
	);
}
