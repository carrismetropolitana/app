/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { MAP_STYLES } from '@/components/map/configs/map-styles';
import { MAP_VIEWPORT } from '@/components/map/configs/map-viewport';
import { MapViewUserLocationButton } from '@/components/map/view/MapViewUserLocationButton';
import { VehiclesCounter } from '@/components/vehicles/common/VehiclesCounter';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { useInterval } from '@/hooks/useInterval';
import { Camera, type CameraRef, Images, MapView as RNMapView, type MapViewRef as RNMapViewRef, UserLocation, UserTrackingMode } from '@maplibre/maplibre-react-native';
import { forwardRef, type PropsWithChildren, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export type MapStyle = 'map' | 'satellite';

interface MapViewProps {

	/**
	 * Callback fired when the map has finished loading.
	 * Use this to fit the map to your data bounds.
	 * The function keeps track of the camera ref for you,
	 * and you can supply a boolean return to indicate if
	 * the operation was successful or not.
	 * @param cameraRef The camera ref of the map
	 * @returns Return true if the operation was successful, false otherwise
	 */
	onDidFinishLoadingMap?: (cameraRef: CameraRef) => boolean

	/**
	 * Number of vehicles to display in the vehicles counter.
	 * If undefined, the counter will not be displayed.
	 */
	vehiclesCounterQty?: number

	/**
	 * Whether to show the user location button.
	 * Defaults to false.
	 */
	withUserLocation?: boolean

}

/* * */

export interface MapViewRef {
	camera_ref: CameraRef | null
}

/* * */

export const MapView = forwardRef<MapViewRef, PropsWithChildren<MapViewProps>>(({ children, onDidFinishLoadingMap, vehiclesCounterQty, withUserLocation }, ref) => {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const mapViewRef = useRef<RNMapViewRef>(null);
	const cameraRef = useRef<CameraRef>(null);

	const mapGlobalContext = useMapGlobalContext();

	const [initialMove, setInitialMove] = useState(false);
	const [isFollowingUser, setIsFollowingUser] = useState(false);

	//
	// B. Transform data

	useImperativeHandle(ref, () => ({
		camera_ref: cameraRef.current,
	}));

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	//
	// C. Handle actions

	useInterval(() => {
		// Skip if already moved
		if (initialMove) return;
		// Skip if no camera ref
		if (!cameraRef?.current) return;
		// Center map on default location
		cameraRef.current.setCamera({
			animationDuration: 1000,
			centerCoordinate: MAP_VIEWPORT.center,
			zoomLevel: MAP_VIEWPORT.zoom,
		});
		// Run provided callback if available
		if (onDidFinishLoadingMap) {
			// Run the callback and store the result
			const result = onDidFinishLoadingMap(cameraRef.current);
			// If result is true, mark as moved
			if (result === true) setInitialMove(true);
			// If result is false, skip marking as moved
			// as the function will be retried on the next interval
			else if (result === false) return;
		}
		// Mark as moved if no callback provided
		else setInitialMove(true);
	}, 1000);

	//
	// D. Render components

	return (
		<View style={styles.container}>

			<RNMapView
				ref={mapViewRef}
				attributionEnabled={false}
				mapStyle={mapStyleData.value}
				style={{ flex: 1 }}
			>
				<Images images={{
					'bus-delay': require('#/map/bus-delay.png'),
					'bus-error': require('#/map/bus-error.png'),
					'bus-regular': require('#/map/bus-regular.png'),
					'shape-direction': require('#/map/shape-direction.png'),
					'stop-pole': require('#/map/stop-pole.png'),
				}}
				/>
				<Camera
					ref={cameraRef}
					animationMode="easeTo"
					followUserLocation={isFollowingUser}
					followUserMode={UserTrackingMode.FollowWithHeading}
					maxZoomLevel={mapStyleData.max_zoom}
					minZoomLevel={mapStyleData.min_zoom}
					onUserTrackingModeChange={({ nativeEvent }) => setIsFollowingUser(nativeEvent.payload.followUserMode === UserTrackingMode.FollowWithHeading)}
				/>
				<UserLocation
					renderMode="native"
					animated
					showsUserHeadingIndicator
					visible
				/>
				{children}
			</RNMapView>

			{vehiclesCounterQty !== undefined && (
				<View style={styles.vehiclesCounterWrapper}>
					<VehiclesCounter qty={vehiclesCounterQty} visibleIfZero />
				</View>
			)}

			{withUserLocation && (
				<View style={styles.userLocationButtonWrapper}>
					<MapViewUserLocationButton
						cameraRef={cameraRef}
						isFollowingUser={isFollowingUser}
						onToggleFollowUser={setIsFollowingUser}
					/>
				</View>
			)}

		</View>
	);

	//
});
