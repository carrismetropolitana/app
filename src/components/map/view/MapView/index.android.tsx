/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { MAP_STYLES } from '@/components/map/configs/map-styles';
import { VehiclesCounter } from '@/components/vehicles/common/VehiclesCounter';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { Camera, type CameraRef, Images, type Location, MapView as RNMapView, type MapViewRef as RNMapViewRef, UserLocation } from '@maplibre/maplibre-react-native';
import { forwardRef, type PropsWithChildren, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
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
	const hasHandledDidFinishLoadingMapRef = useRef(false);
	const [followUserLocation, setFollowUserLocation] = useState(true);

	const mapGlobalContext = useMapGlobalContext();

	useImperativeHandle(ref, () => ({
		get camera_ref() {
			return cameraRef.current;
		},
	}));

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	const shouldRenderUserLocation = withUserLocation || !!onUserLocationUpdate;

	const handleDidFinishLoadingMap = useCallback(() => {
		if (hasHandledDidFinishLoadingMapRef.current) return;
		if (!onDidFinishLoadingMap) return;
		if (!cameraRef.current) return;

		const handled = onDidFinishLoadingMap(cameraRef.current);

		if (handled === true) {
			hasHandledDidFinishLoadingMapRef.current = true;
		}
	}, [onDidFinishLoadingMap]);

	return (
		<View style={styles.container}>
			<RNMapView
				ref={mapViewRef}
				attributionEnabled={false}
				compassEnabled={false}
				mapStyle={mapStyleData.value}
				onDidFinishLoadingMap={handleDidFinishLoadingMap}
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
					followUserLocation={followUserLocation}
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
