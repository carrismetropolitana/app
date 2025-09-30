/* * */

import { useUserLocationContext } from '@/contexts/UserLocation.context';
import { useSystemVariables } from '@/theme/global';
import { type CameraRef } from '@maplibre/maplibre-react-native';
import { IconCurrentLocationFilled, IconCurrentLocationOff, IconNavigationTop } from '@tabler/icons-react-native';
import { type RefObject } from 'react';
import { TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface MapViewUserLocationButtonProps {
	cameraRef?: RefObject<CameraRef | null>
	isFollowingUser?: boolean
	onToggleFollowUser?: (value: boolean) => void
}

/* * */

export function MapViewUserLocationButton({ cameraRef, isFollowingUser, onToggleFollowUser }: MapViewUserLocationButtonProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const userLocationContext = useUserLocationContext();

	//
	// B. Handle actions

	const handleCenterMap = () => {
		// Skip if no camera
		if (!cameraRef?.current) return;
		// Request location permission if not granted
		if (!userLocationContext.flags.enabled) {
			userLocationContext.actions.requestPermission();
		}
		// Skip if no location
		if (!userLocationContext.data.location?.coords.longitude) return;
		if (!userLocationContext.data.location?.coords.latitude) return;
		// Reset camera first
		cameraRef.current.setCamera({});
		// Center map on user location
		cameraRef.current.setCamera({
			animationDuration: 2000,
			animationMode: 'flyTo',
			centerCoordinate: [
				userLocationContext.data.location.coords.longitude,
				userLocationContext.data.location.coords.latitude,
			],
			zoomLevel: 16,
		});
		// Trigger follow user action
		if (onToggleFollowUser) onToggleFollowUser(true);
	};

	//
	// C. Render components

	if (!userLocationContext.flags.enabled) {
		return (
			<TouchableOpacity onPress={handleCenterMap} style={styles.container}>
				<IconCurrentLocationOff color={systemVariables.text[100]} size={32} />
			</TouchableOpacity>
		);
	}

	if (isFollowingUser) {
		return (
			<TouchableOpacity onPress={handleCenterMap} style={[styles.container, styles.containerActive]}>
				<IconNavigationTop color="#ffffff" size={32} />
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
