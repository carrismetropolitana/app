/* * */

import { MapOverlayPath } from '@/components/map/overlays/MapOverlayPath';
import { MapOverlayVehicles, mapOverlayVehicles_TopLayerId } from '@/components/map/overlays/MapOverlayVehicles';
import { MapView } from '@/components/map/view/MapView';
import { useVehicleDetailContext } from '@/contexts/VehicleDetail.context';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { bbox } from '@turf/turf';
import { useCallback } from 'react';
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
	// B. Handle actions

	const handleDidFinishLoadingMap = useCallback((cameraRef: CameraRef) => {
		// Skip if no shape data
		if (!vehicleDetailContext.data.shape_fc) return false;
		// Calculate feature bounds
		const featureBounds = bbox(vehicleDetailContext.data.shape_fc);
		// Fit map to bounds
		cameraRef.fitBounds(
			[featureBounds[0], featureBounds[1], featureBounds[2], featureBounds[3]],
			{
				duration: 1000,
				padding: { bottom: 50, left: 50, right: 50, top: 50 },
			},
		);
		// Return true to indicate success
		// and avoid further attempts
		return true;
	}, [vehicleDetailContext.data.shape_fc]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<MapView
				onDidFinishLoadingMap={handleDidFinishLoadingMap}
				vehiclesCounterQty={vehicleDetailContext.data.vehicle_fc?.features.length ?? 0}
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
