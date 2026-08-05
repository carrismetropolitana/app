/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { MAP_STYLES } from '@/components/map/configs/map-styles';
import { MAP_VIEWPORT } from '@/components/map/configs/map-viewport';
import { MapViewUserLocationButton } from '@/components/map/view/MapViewUserLocationButton';
import { VehiclesCounter } from '@/components/vehicles/common/VehiclesCounter';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { Camera, type CameraRef, type GeolocationPosition, Images, NativeUserLocation, Map as RNMap, type MapRef as RNMapRef, type TrackUserLocation, useCurrentPosition } from '@maplibre/maplibre-react-native';
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
	onUserLocationUpdate?: (location: GeolocationPosition) => void

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

	const mapViewRef = useRef<RNMapRef>(null);
	const cameraRef = useRef<CameraRef>(null);

	const mapGlobalContext = useMapGlobalContext();

	const [trackingMode, setTrackingMode] = useState<'follow' | 'heading' | 'idle'>('idle');
	const [hasLoadedMap, setHasLoadedMap] = useState(false);
	const [hasHandledDidFinishLoadingMap, setHasHandledDidFinishLoadingMap] = useState(false);
	const didFinishLoadingAttemptCountRef = useRef(0);
	const didFinishLoadingRetryTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const tryHandleDidFinishLoadingMapRef = useRef<(() => void) | null>(null);
	const onUserLocationUpdateRef = useRef(onUserLocationUpdate);

	const shouldRenderUserLocation = withUserLocation || !!onUserLocationUpdate;

	const currentPosition = useCurrentPosition({ enabled: shouldRenderUserLocation });

	//
	// B. Transform data

	useImperativeHandle(ref, () => ({
		camera_ref: cameraRef.current,
	}));

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	const trackUserLocation = useMemo((): TrackUserLocation | undefined => {
		if (trackingMode === 'idle') return undefined;
		if (trackingMode === 'heading') return 'heading';
		return 'default';
	}, [trackingMode]);

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
		onUserLocationUpdateRef.current = onUserLocationUpdate;
	}, [onUserLocationUpdate]);

	useEffect(() => {
		if (!currentPosition) return;
		onUserLocationUpdateRef.current?.(currentPosition);
	}, [currentPosition]);

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

			<RNMap
				ref={mapViewRef}
				attribution={false}
				compass={false}
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
					initialViewState={{ center: MAP_VIEWPORT.center as [number, number], zoom: MAP_VIEWPORT.zoom }}
					maxZoom={mapStyleData.max_zoom}
					minZoom={mapStyleData.min_zoom}
					trackUserLocation={trackUserLocation}
					onTrackUserLocationChange={({ nativeEvent }) => {
						if (nativeEvent.trackUserLocation == null) {
							setTrackingMode('idle');
						}
					}}
				/>
				{shouldRenderUserLocation && (
					<NativeUserLocation mode="heading" />
				)}
				{children}
			</RNMap>

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
