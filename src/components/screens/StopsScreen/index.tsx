/* * */

import type { Stop } from '@carrismetropolitana/api-types/network';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import StopSearchBar from '@/components/common/StopSearchBar';
import { MapStyle, MapView } from '@/components/map/MapView';
import { MapViewStylePath } from '@/components/map/MapViewStylePath';
import { MapViewStyleStops } from '@/components/map/MapViewStyleStops';
import StopDetailArrivals from '@/components/stops/detail/StopDetailArrivals';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { useStopsListContext } from '@/contexts/OldStopsList.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { ListItem, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { styles } from './styles';

/* * */

export function StopsScreen() {
	//

	//
	// A. Setup variables

	const locationContext = useLocationsContext();
	const stopsContext = useStopsContext();
	const stopsListContext = useStopsListContext();
	const stopDetailContext = useStopDetailContext();
	const locationsContext = useLocationsContext();
	const mapOptionsContext = useMapOptionsContext();
	const operationalDateContext = useOperationalDateContext();
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();
	const stopMapDetailStyles = styles();
	const [initialCameraSet, setInitialCameraSet] = useState(false);
	const [selectedStop, setSelectedStop] = useState<string>('');
	const [flaggedStopId, setFlaggedStopId] = useState<null | string>(null);
	const [stopData, setStopData] = useState<Stop | undefined>(undefined);
	const [lineShapes, setLineShapes] = useState<FeatureCollection<LineString> | undefined>(undefined);
	const [isStopSelected, setIsStopSelected] = useState(false);
	const [cameraState, setCameraState] = useState<{ center: [number, number], zoom: number }>(() => {
		const camera = locationsContext.data.currentCords;
		return camera ? { center: [camera.longitude, camera.latitude], zoom: 16 } : { center: [0, 0], zoom: 16 };
	});
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const stops = useMemo(() => {
		if (isStopSelected && stopData) {
			const selectedStopFeature: Feature<Point> = {
				geometry: {
					coordinates: [stopData.lon, stopData.lat],
					type: 'Point',
				},
				properties: {
					id: stopData.id,
					long_name: stopData.long_name,
					short_name: stopData.short_name,
					tts_name: stopData.tts_name,
				},
				type: 'Feature',
			};
			const featureCollection: FeatureCollection<Point> = {
				features: [selectedStopFeature],
				type: 'FeatureCollection',
			};
			return featureCollection;
		}
		return stopsListContext.data.filtered_fc || getBaseGeoJsonFeatureCollection();
	}, [isStopSelected, stopData, stopsListContext.data.filtered_fc]);
	const { t } = useTranslation('translation', { keyPrefix: 'stops' });

	//
	// B. Fetch Data

	useEffect(() => {
		locationContext.actions.checkPermission();
	}, []);

	useEffect(() => {
		const c = locationsContext.data.currentCords;
		if (c && !initialCameraSet) {
			setCameraState({ center: [c.longitude, c.latitude], zoom: 16 });
		}
	}, [locationsContext.data.currentCords, initialCameraSet]);

	useEffect(() => {
		if (!selectedStop) {
			setLineShapes(undefined);
			setStopData(undefined);
			return;
		}

		const stopData = stopsContext.actions.getStopById(selectedStop);
		if (stopData) {
			setStopData(stopData);
			bottomSheetModalRef.current?.present();
		}
	}, [selectedStop, operationalDateContext.data.selected_date]);

	//
	// C. Handle actions
	const handleCenterStop = (stop: Stop) => {
		setCameraState({ center: [stop.lon, stop.lat - 0.0003], zoom: 18 });
	};
	const handleStopPress = (stopId: string) => {
		const stop = stopsContext.actions.getStopById(stopId);
		if (!stop) return;
		setSelectedStop(stopId);
		setFlaggedStopId(stopId);
		stopDetailContext.actions.setActiveStopId(stopId);
		setIsStopSelected(true);
		handleCenterStop(stop);
		bottomSheetModalRef.current?.present();
	};
	const handleStopDeselect = () => {
		if (bottomSheetModalRef.current) {
			bottomSheetModalRef.current.close();
		}
		setSelectedStop('');
		setFlaggedStopId(null);
		setStopData(undefined);
		stopDetailContext.actions.resetActiveStopId();
		stopDetailContext.actions.setActiveStopId('');
		setLineShapes(undefined);
		setIsStopSelected(false);
	};

	//
	// D. Render components

	return (
		<>
			<MapView
				camera={{ centerCoordinate: cameraState.center, zoomLevel: cameraState.zoom }}
				mapStyle={(mapOptionsContext.data.style as MapStyle) ?? 'map'}
				onPress={handleStopDeselect}
				onRegionDidChange={() => { if (!initialCameraSet) setInitialCameraSet(true); }}
				scrollZoom
				toolbar
			>
				<MapViewStylePath shapeData={lineShapes} waypointsData={getBaseGeoJsonFeatureCollection()} />
				{stops && (
					<MapViewStyleStops flaggedStopId={flaggedStopId || undefined} onStopPress={handleStopPress} stopsData={stops} />
				)}
				{locationsContext.data.currentCords && (
					<PointAnnotation coordinate={[locationsContext.data.currentCords.longitude, locationsContext.data.currentCords.latitude]} id="userLocation">
						<View style={{ backgroundColor: '#007AFF', borderColor: 'white', borderRadius: 12, borderWidth: 1, height: 12, width: 12 }} />
					</PointAnnotation>
				)}
			</MapView>
			<View style={{ left: 0, paddingTop: insets.top + 10, position: 'absolute', right: 0, top: 0, zIndex: 1000 }}>
				<StopSearchBar counter={false} disabled={isStopSelected} onPress={handleStopDeselect} />
			</View>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				backgroundStyle={{ backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200 }}
				snapPoints={['70%']}
			>
				<BottomSheetScrollView contentContainerStyle={{ paddingBottom: 74 + insets.bottom }} style={stopMapDetailStyles.contentContainer}>
					{stopData && (
						<>
							<ListItem>
								<TouchableOpacity onPress={() => router.push(`/stops/${stopData.id}`)} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
									<ListItem.Content>
										<View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
											<Svg fill="none" height={21} viewBox="0 0 20 21" width={20}>
												<Circle cx={10} cy={10.5} fill="#FFDD00" r={9} stroke="black" strokeWidth={2} />
											</Svg>
											<View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
												<ListItem.Title>
													<Text style={stopMapDetailStyles.stopName}>{stopData.long_name}</Text>
												</ListItem.Title>
												<ListItem.Subtitle>
													<Text style={stopMapDetailStyles.metaData}>{stopData.id}</Text>
													<Text style={stopMapDetailStyles.metaData}> • </Text>
													<Text style={stopMapDetailStyles.metaData}>
														{(() => {
															const municipality = locationsContext.actions.getMunicipalityById(stopData.municipality_id);
															return municipality ? municipality.name : stopData.municipality_id;
														})()}
													</Text>
												</ListItem.Subtitle>
											</View>
										</View>

									</ListItem.Content>
									<View style={{ width: 24 }} />
									<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
								</TouchableOpacity>
							</ListItem>
							<View style={stopMapDetailStyles.nextArrivalsContainer}>
								<Text style={stopMapDetailStyles.nextArrivalsLabel}>{t('StopDetails.nextArrivalsLabel')}</Text>
								<StopDetailArrivals href={`/stops/${selectedStop}`} />
							</View>
						</>
					)}
					{!stopData && <NoDataLabel text={t('noDataFound')} />}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);

	//
}
