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

	const handleCenterMap = async () => {
		// Skip if no camera
		if (!cameraRef?.current) return;
		// Request location permission if not granted
		if (!userLocationContext.flags.has_permission && userLocationContext.flags.can_request) {
			await userLocationContext.actions.requestPermission();
			return;
		}
		// Trigger follow user action
		if (onToggleFollowUser) onToggleFollowUser(true);
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
