/* * */

import { MapViewToolbar } from '@/components/map/MapViewToolbar';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { IconsMap } from '@/settings/assets.settings';
import { mapDefaultConfig } from '@/settings/map.settings';
import { theming } from '@/theme/Variables';
import { Camera, Images, MapViewRef, MapView as RNMapView } from '@maplibre/maplibre-react-native';
import { IconInfoCircle } from '@tabler/icons-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Linking, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/* * */

export type MapStyle = 'map' | 'satellite';

interface Props {
	camera?: {
		centerCoordinate: [number, number]
		zoomLevel: number
	}
	children: React.ReactNode
	fitBoundsCoords?: [[number, number], [number, number]]
	mapStyle?: MapStyle
	onPress?: (e: any) => void
	onRegionDidChange?: (e: any) => void
	onRegionIsChanging?: (e: any) => void
	onRegionWillChange?: (e: any) => void
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
	const latRad = (lat: number) => {
		const sin = Math.sin((lat * Math.PI) / 180);
		const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
		return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
	};
	const zoom = (px: number, worldPx: number, fraction: number) => Math.floor(Math.log(px / worldPx / fraction) / Math.LN2);
	const latFraction = (latRad(ne[1]) - latRad(sw[1])) / Math.PI;
	const lngDiff = ne[0] - sw[0];
	const lngFraction = ((lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360);
	const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
	const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);
	return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

export function MapView({ camera, children, fitBoundsCoords, mapStyle, onPress, onRegionDidChange, onRegionIsChanging, onRegionWillChange, scrollZoom = true, toolbar = true }: Props) {
	//

	//
	// A. Setup Variables

	const [modalVisible, setModalVisible] = useState(false);
	const [userInteracted, setUserInteracted] = useState(false);
	const mapRef = useRef<MapViewRef>(null);
	const mapOptionsContext = useMapOptionsContext();
	const { data: { currentCords } } = useLocationsContext();
	const [internalCam, setInternalCam] = useState<{
		centerCoordinate: [number, number]
		zoomLevel: number
	}>({
		centerCoordinate: [
			mapDefaultConfig.initialViewState.longitude,
			mapDefaultConfig.initialViewState.latitude,
		],
		zoomLevel: mapDefaultConfig.initialViewState.zoom,
	});
	const styleUrl = mapStyle
		? mapDefaultConfig.styles[mapStyle]
		: mapDefaultConfig.styles[
			mapOptionsContext.data.style === 'satellite'
				? 'satellite'
				: 'map'
		];

	//
	// B. Handle Actions

	useEffect(() => {
		if (camera?.centerCoordinate && camera.zoomLevel != null) {
			setUserInteracted(false);
			setInternalCam({
				centerCoordinate: camera.centerCoordinate,
				zoomLevel: camera.zoomLevel,
			});
		}
	}, [
		camera?.centerCoordinate[0],
		camera?.centerCoordinate[1],
		camera?.zoomLevel,
	]);

	const handleCenterOnUser = useCallback(() => {
		if (currentCords) {
			setUserInteracted(false);
			setInternalCam({
				centerCoordinate: [
					currentCords.longitude,
					currentCords.latitude,
				],
				zoomLevel: 14,
			});
		}
	}, [currentCords]);

	const handleMapReady = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;
		if (fitBoundsCoords && (map as any).setCamera) {
			const [sw, ne] = fitBoundsCoords;
			const center: [number, number] = [(sw[0] + ne[0]) / 2, (sw[1] + ne[1]) / 2];
			const { height, width } = Dimensions.get('window');
			const zoomLevel = getBoundsZoomLevel(sw, ne, width, height);
			(map as any).setCamera({ animationDuration: 1000, centerCoordinate: center, zoomLevel });
		}
		mapOptionsContext.actions.setMap(map as any);
	}, [fitBoundsCoords, mapOptionsContext.actions]);

	const handleRegionWillChange = useCallback(
		(e: any) => {
			setUserInteracted(true);
			onRegionWillChange?.(e);
		},
		[onRegionWillChange],
	);

	//
	// C. Render Components

	return (
		<View style={styles.container}>
			{toolbar && (<MapViewToolbar onCenterMap={handleCenterOnUser} />)}
			<RNMapView
				ref={mapRef}
				attributionEnabled={false}
				mapStyle={styleUrl}
				onDidFinishLoadingMap={handleMapReady}
				onPress={onPress}
				onRegionDidChange={onRegionDidChange}
				onRegionIsChanging={onRegionIsChanging}
				onRegionWillChange={handleRegionWillChange}
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
				{!userInteracted && (
					<Camera
						key={`${internalCam.centerCoordinate[0]},${internalCam.centerCoordinate[1]}|${internalCam.zoomLevel}`}
						animationDuration={1500}
						animationMode="linearTo"
						centerCoordinate={internalCam.centerCoordinate}
						followUserLocation={false}
						zoomLevel={internalCam.zoomLevel}
					/>
				)}
				{children}
			</RNMapView>

			<TouchableOpacity activeOpacity={0.7} onPress={() => setModalVisible(true)} style={styles.customInfoButton}>
				<Text style={styles.infoIcon}> <IconInfoCircle color={theming.colorSystemText300} size={24} /> </Text>
			</TouchableOpacity>

			<Modal animationType="slide" onRequestClose={() => setModalVisible(false)} visible={modalVisible} transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Map Attribution</Text>
						<Text style={styles.modalBody}> This map uses tiles from OpenStreetMap contributors and MapTiler.</Text>
						<Pressable
							style={styles.modalButton}
							onPress={() => {
								Linking.openURL('https://maps.carrismetropolitana.pt/');
								setModalVisible(false);
							}}
						>
							<Text style={styles.modalButtonText}> If you want to use this map </Text>
						</Pressable>
						<Pressable
							style={styles.modalButton}
							onPress={() => {
								Linking.openURL(
									'https://www.openstreetmap.org/copyright',
								);
								setModalVisible(false);
							}}
						>
							<Text style={styles.modalButtonText}> © OpenStreetMap contributors </Text>
						</Pressable>
						<Pressable
							style={styles.modalButton}
							onPress={() => {
								Linking.openURL('https://www.openmaptiles.org/');
								setModalVisible(false);
							}}
						>
							<Text style={styles.modalButtonText}> © OpenMapTiles </Text>
						</Pressable>
						<Pressable
							style={styles.modalButton}
							onPress={() => {
								Linking.openURL('https://maplibre.org/');
								setModalVisible(false);
							}}
						>
							<Text style={styles.modalButtonText}> MapLibre </Text>
						</Pressable>
						<Pressable onPress={() => setModalVisible(false)} style={[styles.modalButton, { marginTop: 8 }]}>
							<Text style={styles.modalButtonText}>Close</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);

	//
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	customInfoButton: {
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.9)',
		borderRadius: 16,
		bottom: 12,
		elevation: 3,
		height: 32,
		justifyContent: 'center',
		position: 'absolute',
		right: 12,
		shadowColor: '#000',
		shadowOffset: { height: 1, width: 0 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		width: 32,
	},
	infoIcon: { color: '#333', fontSize: 18 },
	map: { flex: 1 },
	modalBody: { fontSize: 14, marginBottom: 12, textAlign: 'center' },
	modalButton: {
		backgroundColor: '#007AFF',
		borderRadius: 6,
		marginTop: 10,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	modalButtonText: { color: 'white', fontSize: 14 },
	modalContent: {
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 16,
		width: '80%',
	},
	modalOverlay: {
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
		flex: 1,
		justifyContent: 'center',
	},
	modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
});
