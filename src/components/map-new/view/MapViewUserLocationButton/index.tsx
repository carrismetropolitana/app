/* * */

import { useUserLocationContext } from '@/contexts/UserLocation.context';
import { useSystemVariables } from '@/theme/global';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { IconCurrentLocationFilled } from '@tabler/icons-react-native';
import { TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface MapViewUserLocationButtonProps {
	cameraRef?: CameraRef | null
}

/* * */

export function MapViewUserLocationButton({ cameraRef }: MapViewUserLocationButtonProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const userLocationContext = useUserLocationContext();

	//
	// B. Handle actions

	const handleCenterMap = async () => {
		// Skip if no camera
		if (!cameraRef) return;
		// Request location permission if not granted
		await userLocationContext.actions.requestPermission();
		// Skip if no location
		if (!userLocationContext.data.location?.coords.longitude) return;
		if (!userLocationContext.data.location?.coords.latitude) return;
		// Center map on user location
		cameraRef.setCamera({
			animationDuration: 2000,
			animationMode: 'flyTo',
			centerCoordinate: [
				userLocationContext.data.location.coords.longitude,
				userLocationContext.data.location.coords.latitude,
			],
			zoomLevel: 16,
		});
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onPress={handleCenterMap} style={styles.container}>
			<IconCurrentLocationFilled color={systemVariables.text[100]} size={32} />
		</TouchableOpacity>
	);

	//
}
