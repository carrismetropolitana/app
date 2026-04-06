/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { MAP_STYLES } from '@/components/map/configs/map-styles';
import { MAP_VIEWPORT } from '@/components/map/configs/map-viewport';
import { VehiclesCounter } from '@/components/vehicles/common/VehiclesCounter';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { useUserLocationContext } from '@/contexts/UserLocation.context';
import { Camera, type CameraRef, Images, type Location, MapView as RNMapView, type MapViewRef as RNMapViewRef, UserLocation } from '@maplibre/maplibre-react-native';
import { forwardRef, type PropsWithChildren, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export type MapStyle = 'map' | 'satellite';

interface MapViewProps {
	onDidFinishLoadingMap?: (cameraRef: CameraRef) => boolean | undefined
	onUserLocationUpdate?: (location: Location) => void
	vehiclesCounterQty?: number
	withUserLocation?: boolean
}

/* * */

export interface MapViewRef {
	camera_ref: CameraRef | null
}

/* * */

export const MapView = forwardRef<MapViewRef, PropsWithChildren<MapViewProps>>(({
	children,
	onDidFinishLoadingMap,
	onUserLocationUpdate,
	vehiclesCounterQty,
	withUserLocation,
}, ref) => {
	const styles = useStyles();

	const mapViewRef = useRef<RNMapViewRef>(null);
	const cameraRef = useRef<CameraRef>(null);
	const [followUserLocation, setFollowUserLocation] = useState(true);

	const [hasLoadedMap, setHasLoadedMap] = useState(false);
	const [hasHandledDidFinishLoadingMap, setHasHandledDidFinishLoadingMap] = useState(false);
	const didFinishLoadingAttemptCountRef = useRef(0);
	const didFinishLoadingRetryTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
	const tryHandleDidFinishLoadingMapRef = useRef<(() => void) | null>(null);

	const mapGlobalContext = useMapGlobalContext();
	const { flags } = useUserLocationContext();

	useImperativeHandle(ref, () => ({
		get camera_ref() {
			return cameraRef.current;
		},
	}));

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	const shouldRenderUserLocation = (withUserLocation || !!onUserLocationUpdate) && flags.has_permission;
	const shouldFollowUser = withUserLocation && flags.has_permission && followUserLocation;

	const clearDidFinishLoadingRetry = useCallback(() => {
		if (didFinishLoadingRetryTimeoutRef.current) {
			clearTimeout(didFinishLoadingRetryTimeoutRef.current);
			didFinishLoadingRetryTimeoutRef.current = null;
		}
	}, []);

	const tryHandleDidFinishLoadingMap = useCallback(() => {
		clearDidFinishLoadingRetry();

		if (!hasLoadedMap) return;
		if (hasHandledDidFinishLoadingMap) return;
		if (!onDidFinishLoadingMap) return;
		if (shouldFollowUser) return;
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
	}, [clearDidFinishLoadingRetry, hasHandledDidFinishLoadingMap, hasLoadedMap, shouldFollowUser, onDidFinishLoadingMap]);

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
	}, [clearDidFinishLoadingRetry, tryHandleDidFinishLoadingMap]);

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
					defaultSettings={{ centerCoordinate: MAP_VIEWPORT.center as [number, number], zoomLevel: MAP_VIEWPORT.zoom }}
					followUserLocation={shouldFollowUser}
					maxZoomLevel={mapStyleData.max_zoom}
					minZoomLevel={mapStyleData.min_zoom}
					onUserTrackingModeChange={(event) => {
						if (!event.nativeEvent.payload.followUserLocation) {
							setFollowUserLocation(false);
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
		</View>
	);
});
