/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { MAP_STYLES } from '@/components/map/configs/map-styles';
import { MapViewUserLocationButton } from '@/components/map/view/MapViewUserLocationButton';
import { VehiclesCounter } from '@/components/vehicles/common/VehiclesCounter';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { Camera, type CameraRef, Images, Location, MapView as RNMapView, type MapViewRef as RNMapViewRef, UserLocation, UserTrackingMode } from '@maplibre/maplibre-react-native';
import { forwardRef, type PropsWithChildren, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export type MapStyle = 'map' | 'satellite';

interface MapViewProps {

	/**
	 * Optional callback invoked after the native map reports it finished loading.
	 * Useful for positioning the camera (e.g. fit bounds).
	 * If the callback returns true, it will not be called again.
	 */
	onDidFinishLoadingMap?: (cameraRef: CameraRef) => boolean | undefined

	/**
	 * Optional callback invoked when the user's location is updated.
	 * If the callback returns true, the map will not automatically center on the user's location.
	 * This allows for custom handling of user location updates, such as implementing a "follow user" mode.
	 */
	onUserLocationUpdate?: (location: Location) => void

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

export const MapView = forwardRef<MapViewRef, PropsWithChildren<MapViewProps>>(({ children, onDidFinishLoadingMap, onUserLocationUpdate, vehiclesCounterQty, withUserLocation }, ref) => {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const mapViewRef = useRef<RNMapViewRef>(null);
	const cameraRef = useRef<CameraRef>(null);

	const mapGlobalContext = useMapGlobalContext();

	const [trackingMode, setTrackingMode] = useState<'follow' | 'heading' | 'idle'>('idle');
	const [hasLoadedMap, setHasLoadedMap] = useState(false);
	const [hasHandledDidFinishLoadingMap, setHasHandledDidFinishLoadingMap] = useState(false);
	const didFinishLoadingAttemptCountRef = useRef(0);
	const didFinishLoadingRetryTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const tryHandleDidFinishLoadingMapRef = useRef<(() => void) | null>(null);

	//
	// B. Transform data

	useImperativeHandle(ref, () => ({
		camera_ref: cameraRef.current,
	}));

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	const shouldRenderUserLocation = withUserLocation || !!onUserLocationUpdate;

	const clearDidFinishLoadingRetry = useCallback(() => {
		if (didFinishLoadingRetryTimeoutRef.current) {
			clearTimeout(didFinishLoadingRetryTimeoutRef.current);
			didFinishLoadingRetryTimeoutRef.current = null;
		}
	}, []);

	const handleCycleTrackingMode = useCallback(() => {
		setTrackingMode((prev) => {
			if (prev === 'idle') return 'follow';
			if (prev === 'follow') return 'heading';
			return 'idle';
		});
	}, []);

	const tryHandleDidFinishLoadingMap = useCallback(() => {
		clearDidFinishLoadingRetry();

		if (!hasLoadedMap) return;
		if (hasHandledDidFinishLoadingMap) return;
		if (!onDidFinishLoadingMap) return;
		if (trackingMode !== 'idle') return;
		if (!cameraRef.current) {
			didFinishLoadingAttemptCountRef.current += 1;
			if (didFinishLoadingAttemptCountRef.current > 10) return;
			didFinishLoadingRetryTimeoutRef.current = setTimeout(() => tryHandleDidFinishLoadingMapRef.current?.(), 150);
			return;
		}

		const handled = onDidFinishLoadingMap(cameraRef.current);
		if (handled === true) {
			setHasHandledDidFinishLoadingMap(true);
			return;
		}

		didFinishLoadingAttemptCountRef.current += 1;
		if (didFinishLoadingAttemptCountRef.current > 10) return;
		didFinishLoadingRetryTimeoutRef.current = setTimeout(() => tryHandleDidFinishLoadingMapRef.current?.(), 150);
	}, [clearDidFinishLoadingRetry, hasHandledDidFinishLoadingMap, hasLoadedMap, trackingMode, onDidFinishLoadingMap]);

	useEffect(() => {
		tryHandleDidFinishLoadingMapRef.current = tryHandleDidFinishLoadingMap;
		return () => {
			tryHandleDidFinishLoadingMapRef.current = null;
		};
	}, [tryHandleDidFinishLoadingMap]);

	useEffect(() => {
		didFinishLoadingAttemptCountRef.current = 0;
		tryHandleDidFinishLoadingMap();
		return () => clearDidFinishLoadingRetry();
		// Re-attempt whenever the callback changes (it captures data like geojson)
		// or whenever the map transitions to loaded.
	}, [clearDidFinishLoadingRetry, tryHandleDidFinishLoadingMap]);

	//
	// C. Render components

	return (
		<View style={styles.container}>

			<RNMapView
				ref={mapViewRef}
				attributionEnabled={false}
				compassEnabled={false}
				mapStyle={mapStyleData.value}
				onDidFinishLoadingMap={() => setHasLoadedMap(true)}
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
					followUserLocation={trackingMode !== 'idle'}
					followUserMode={trackingMode === 'heading' ? UserTrackingMode.FollowWithHeading : UserTrackingMode.Follow}
					maxZoomLevel={mapStyleData.max_zoom}
					minZoomLevel={mapStyleData.min_zoom}
					onUserTrackingModeChange={({ nativeEvent }) => {
						const newMode = nativeEvent.payload.followUserMode;
						if (newMode !== UserTrackingMode.Follow && newMode !== UserTrackingMode.FollowWithHeading) {
							setTrackingMode('idle');
						}
					}}
				/>
				{shouldRenderUserLocation && (
					<UserLocation
						onUpdate={onUserLocationUpdate}
						renderMode="native"
						animated
						showsUserHeadingIndicator
						visible
					/>
				)}
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
						onCycleTrackingMode={handleCycleTrackingMode}
						trackingMode={trackingMode}
					/>
				</View>
			)}

		</View>
	);

	//
});
