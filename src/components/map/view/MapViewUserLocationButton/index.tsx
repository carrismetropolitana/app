/* * */

import { useUserLocationContext } from '@/contexts/UserLocation.context';
import { useSystemVariables } from '@/theme/global';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { IconCurrentLocation, IconCurrentLocationFilled, IconCurrentLocationOff, IconNavigationTop } from '@tabler/icons-react-native';
import { type RefObject } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface MapViewUserLocationButtonProps {
	cameraRef?: RefObject<CameraRef | null>
	onCycleTrackingMode?: () => void
	trackingMode?: 'follow' | 'heading' | 'idle'
}

/* * */

export function MapViewUserLocationButton({ onCycleTrackingMode, trackingMode = 'idle' }: MapViewUserLocationButtonProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const userLocationContext = useUserLocationContext();

	//
	// B. Handle actions

	const handleCenterMap = async () => {
		// Request permission when transitioning out of idle with no permission
		if (trackingMode === 'idle' && !userLocationContext.flags.has_permission && userLocationContext.flags.can_request) {
			await userLocationContext.actions.requestPermission();
			return;
		}
		onCycleTrackingMode?.();
	};

	//
	// C. Render components

	if (!userLocationContext.flags.can_request) {
		return (
			<View style={styles.container}>
				<IconCurrentLocationOff color={systemVariables.text[400]} size={32} />
			</View>
		);
	}

	if (!userLocationContext.flags.has_permission) {
		return (
			<TouchableOpacity onPress={handleCenterMap} style={styles.container}>
				<IconCurrentLocation color={systemVariables.text[100]} size={32} />
			</TouchableOpacity>
		);
	}

	if (trackingMode === 'heading') {
		return (
			<TouchableOpacity onPress={handleCenterMap} style={[styles.container, styles.containerActive]}>
				<IconNavigationTop color="#ffffff" size={32} />
			</TouchableOpacity>
		);
	}

	if (trackingMode === 'follow') {
		return (
			<TouchableOpacity onPress={handleCenterMap} style={[styles.container, styles.containerActive]}>
				<IconCurrentLocationFilled color="#ffffff" size={32} />
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPress={handleCenterMap} style={styles.container}>
			<IconCurrentLocationFilled color={systemVariables.text[100]} size={32} />
		</TouchableOpacity>
	);

	//
}
