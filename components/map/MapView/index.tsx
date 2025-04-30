import { MapViewToolbar } from '@/components/map/MapViewToolbar';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { IconsMap } from '@/settings/assets.settings';
import { mapDefaultConfig } from '@/settings/map.settings';
import {
	Camera,
	CameraRef,
	Images,
	MapViewRef,
	MapView as RNMapView,
} from '@maplibre/maplibre-react-native';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

export type MapStyle = 'map' | 'satellite';

interface Props {
	children: React.ReactNode
	id?: string
	mapStyle?: MapStyle
	onCenterMap?: () => void
	onPress?: (e: unknown) => void
	onRegionDidChange?: (e: unknown) => void
	onRegionIsChanging?: (e: unknown) => void
	onRegionWillChange?: (e: unknown) => void
	scrollZoom?: boolean
	toolbar?: boolean
}

export function MapView({
	children,
	id,
	mapStyle,
	onCenterMap,
	onPress,
	onRegionDidChange,
	onRegionIsChanging,
	onRegionWillChange,
	scrollZoom = true,
	toolbar = true,
}: Props) {
	const mapRef = useRef<MapViewRef>(null);
	const cameraRef = useRef<CameraRef>(null);
	const mapOptionsContext = useMapOptionsContext();

	const styleUrl = mapStyle
		? mapDefaultConfig.styles[mapStyle]
		: mapOptionsContext.data.style;

	const handleMapReady = useCallback(() => {
		const map = mapRef.current;
		const camera = cameraRef.current;
		if (!map || !camera) return;

		const extendedMap: any = map;
		extendedMap.setCamera = camera.setCamera.bind(camera);

		mapOptionsContext.actions.setMap(extendedMap);
	}, [mapOptionsContext.actions]);

	return (
		<View style={styles.container}>
			{toolbar && (
				<MapViewToolbar onCenterMap={onCenterMap} />
			)}

			<RNMapView
				ref={mapRef}
				mapStyle={styleUrl}
				onDidFinishLoadingMap={handleMapReady}
				onPress={onPress}
				onRegionDidChange={onRegionDidChange}
				onRegionIsChanging={onRegionIsChanging}
				onRegionWillChange={onRegionWillChange}
				rotateEnabled={false}
				scrollEnabled={scrollZoom}
				style={styles.map}
			>
				<Images
					images={{
						'cmet-bus-delay': IconsMap.bus_delay,
						'cmet-bus-error': IconsMap.bus_error,
						'cmet-bus-regular': IconsMap.bus_regular,
						'cmet-pin': IconsMap.pin,
						'cmet-shape-direction': IconsMap.shape_direction,
						'cmet-stop-selected': IconsMap.stop_selected,
						'cmet-store-busy': IconsMap.store_busy,
						'cmet-store-closed': IconsMap.store_closed,
						'cmet-store-open': IconsMap.store_open,
					}}
				/>

				{/* Declarative camera for initial viewport */}
				<Camera
					animationMode="flyTo"
					heading={mapDefaultConfig.initialViewState.bearing}
					maxZoomLevel={mapDefaultConfig.maxZoom}
					minZoomLevel={mapDefaultConfig.minZoom}
					pitch={mapDefaultConfig.initialViewState.pitch}
					zoomLevel={mapDefaultConfig.initialViewState.zoom}
					centerCoordinate={[
						mapDefaultConfig.initialViewState.longitude,
						mapDefaultConfig.initialViewState.latitude,
					]}
				/>

				{children}
			</RNMapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	map: { flex: 1 },
	toolbar: {
		left: 10,
		position: 'absolute',
		right: 10,
		top: 10,
		zIndex: 2,
	},
});
