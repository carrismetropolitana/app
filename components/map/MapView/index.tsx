import { MapViewToolbar } from '@/components/map/MapViewToolbar';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { IconsMap } from '@/settings/assets.settings';
import { mapDefaultConfig } from '@/settings/map.settings';
import {
	Camera,
	Images,
	MapViewRef,
	MapView as RNMapView,
} from '@maplibre/maplibre-react-native';
import React, { useCallback, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

export type MapStyle = 'map' | 'satellite';

interface Props {
	children: React.ReactNode
	/** Pass [[minLon, minLat], [maxLon, maxLat]] to fit bounds on ready */
	fitBoundsCoords?: [[number, number], [number, number]]
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

function getBoundsZoomLevel(
	sw: [number, number],
	ne: [number, number],
	mapWidth: number,
	mapHeight: number,
) {
	const WORLD_DIM = { height: 256, width: 256 };
	const ZOOM_MAX = 20;

	function latRad(lat: number) {
		const sin = Math.sin((lat * Math.PI) / 180);
		const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	}

	function zoom(mapPx: number, worldPx: number, fraction: number) {
		return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
	}

	const latFraction = (latRad(ne[1]) - latRad(sw[1])) / Math.PI;
	const lngDiff = ne[0] - sw[0];
	const lngFraction = ((lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360);

	const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
	const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

export function MapView({
	children,
	fitBoundsCoords,
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
	const mapOptionsContext = useMapOptionsContext();

	const styleUrl = mapStyle
		? mapDefaultConfig.styles[mapStyle]
		: mapOptionsContext.data.style;

	const handleMapReady = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;

		// Fit bounds if coordinates are provided
		if (fitBoundsCoords && typeof (map as any).setCamera === 'function') {
			const [sw, ne] = fitBoundsCoords;
			const center = [
				(sw[0] + ne[0]) / 2,
				(sw[1] + ne[1]) / 2,
			];
			const { height, width } = Dimensions.get('window');
			const zoomLevel = getBoundsZoomLevel(sw, ne, width, height);

			(map as any).setCamera({
				animationDuration: 1000,
				centerCoordinate: center,
				zoomLevel,
			});
		}

		mapOptionsContext.actions.setMap(map);
	}, [mapOptionsContext.actions, fitBoundsCoords]);

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
