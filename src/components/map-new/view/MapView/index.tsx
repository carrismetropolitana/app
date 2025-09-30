/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { VehiclesCounter } from '@/components/common/VehiclesCounter';
import { MAP_STYLES } from '@/components/map-new/configs/map-styles';
import { MAP_VIEWPORT } from '@/components/map-new/configs/map-viewport';
import { MapViewUserLocationButton } from '@/components/map-new/view/MapViewUserLocationButton';
import { useMapGlobalContext } from '@/contexts/MapGlobal.context';
import { Camera, type CameraRef, Images, type MapViewRef, MapView as RNMapView, UserLocation, UserTrackingMode } from '@maplibre/maplibre-react-native';
import { type PropsWithChildren, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export type MapStyle = 'map' | 'satellite';

interface MapViewProps {
	vehiclesCounterQty?: number
	withUserLocation?: boolean
}

/* * */

export function MapView({ children, vehiclesCounterQty, withUserLocation }: PropsWithChildren<MapViewProps>) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const mapViewRef = useRef<MapViewRef>(null);
	const cameraRef = useRef<CameraRef>(null);

	const mapGlobalContext = useMapGlobalContext();

	const [initialMove, setInitialMove] = useState(false);
	const [isFollowingUser, setIsFollowingUser] = useState(false);

	//
	// B. Transform data

	const mapStyleData = useMemo(() => {
		return MAP_STYLES[mapGlobalContext.data.style];
	}, [mapGlobalContext.data.style]);

	//
	// C. Handle actions

	const handleCenterMap = () => {
		if (initialMove) return;
		if (!cameraRef.current) return;
		// Center map on default location
		cameraRef.current.setCamera({
			animationDuration: 1000,
			centerCoordinate: MAP_VIEWPORT.center,
			zoomLevel: MAP_VIEWPORT.zoom,
		});
		setInitialMove(true);
	};

	//
	// D. Render components

	return (
		<View style={styles.container}>

			<RNMapView
				ref={mapViewRef}
				attributionEnabled={false}
				mapStyle={mapStyleData.value}
				onDidFinishLoadingMap={handleCenterMap}
				style={{ flex: 1 }}
			>
				<Images images={{
					'bus-delay': require('#/map/bus-delay.png'),
					'bus-error': require('#/map/bus-error.png'),
					'bus-regular': require('#/map/bus-regular.png'),
					'shape-direction': require('#/map/shape-direction.png'),
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
}
