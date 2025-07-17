/* * */

import type { Stop } from '@carrismetropolitana/api-types/network';

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { MapStyle, MapView } from '@/components/map/MapView';
import { MapViewStyleStops } from '@/components/map/MapViewStyleStops';
import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { PointAnnotation } from '@maplibre/maplibre-react-native';
import { ListItem, Text } from '@rn-vui/themed';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { styles } from './styles';

/* * */

export default function StopsScreen() {
	//

	//
	// A. Setup Variables

	const stopsContext = useStopsContext();
	const stopDetailContext = useStopsDetailContext();
	const locationsContext = useLocationsContext();
	const mapOptionsContext = useMapOptionsContext();
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();
	const stopMapDetailStyles = styles();
	const [initialCameraSet, setInitialCameraSet] = useState(false);
	const [selectedStop, setSelectedStop] = useState<string>('');
	const [flaggedStopId, setFlaggedStopId] = useState<null | string>(null);
	const [stopData, setStopData] = useState<Stop | undefined>(undefined);
	const [cameraState, setCameraState] = useState<{ center: [number, number], zoom: number }>(() => {
		const camera = locationsContext.data.currentCords;
		return camera ? { center: [camera.longitude, camera.latitude], zoom: 16 } : { center: [0, 0], zoom: 16 };
	});
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const stops = stopsContext.actions.getAllStopsGeoJsonFC();

	//
	// B. Fetch Data

	useEffect(() => {
		const c = locationsContext.data.currentCords;
		if (c && !initialCameraSet) {
			setCameraState({ center: [c.longitude, c.latitude], zoom: 16 });
		}
	}, [locationsContext.data.currentCords, initialCameraSet]);

	useEffect(() => {
		if (!selectedStop) return;
		const stopData = stopsContext.actions.getStopById(selectedStop);
		if (stopData) {
			setStopData(stopData);
			bottomSheetModalRef.current?.present();
		}
	}, [selectedStop]);

	//
	// C. Handle Actions

	const handleCenterUser = () => {
		const loc = locationsContext.data.currentCords;
		if (loc) setCameraState({ center: [loc.longitude, loc.latitude], zoom: 18 });
	};
	const handleCenterStop = (stop: Stop) => {
		setCameraState({ center: [stop.lon, stop.lat], zoom: 18 });
	};
	const handleStopPress = (stopId: string) => {
		const stop = stopsContext.actions.getStopById(stopId);
		if (!stop) return;
		setSelectedStop(stopId);
		setFlaggedStopId(stopId);
		stopDetailContext.actions.setActiveStopId(stopId);
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
		handleCenterUser();
	};

	//
	// D. Render Components

	return (
		<SafeAreaView style={stopMapDetailStyles.container}>
			<MapView
				camera={{ centerCoordinate: cameraState.center, zoomLevel: cameraState.zoom }}
				mapStyle={(mapOptionsContext.data.style as MapStyle) ?? 'map'}
				onPress={handleStopDeselect}
				onRegionDidChange={() => { if (!initialCameraSet) setInitialCameraSet(true); }}
				scrollZoom
				toolbar
			>
				{stops && (
					<MapViewStyleStops flaggedStopId={flaggedStopId || undefined} onStopPress={handleStopPress}stopsData={stops} />
				)}
				{locationsContext.data.currentCords && (
					<PointAnnotation
						coordinate={[locationsContext.data.currentCords.longitude, locationsContext.data.currentCords.latitude]}
						id="userLocation"
					>
						<View style={{ backgroundColor: '#007AFF', borderColor: 'white', borderRadius: 12, borderWidth: 1, height: 12, width: 12 }} />
					</PointAnnotation>
				)}
			</MapView>

			<BottomSheetModal
				ref={bottomSheetModalRef}
				backgroundStyle={{ backgroundColor: themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200 }}
				snapPoints={['70%']}
			>
				<BottomSheetScrollView
					style={stopMapDetailStyles.contentContainer}
					contentContainerStyle={{
						paddingBottom: 74 + insets.bottom,
					}}
				>
					{stopData && (
						<>
							<ListItem>
								<ListItem.Content>
									<Link href={`/stop/${stopData.id}`} style={{ width: '100%' }}>
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
													<Text style={stopMapDetailStyles.metaData}>{stopData.municipality_id}</Text>
												</ListItem.Subtitle>
											</View>
										</View>
									</Link>
								</ListItem.Content>
								<View style={{ width: 24 }} />
								<ListItem.Chevron />
							</ListItem>
							<StopDetailNextArrivals href={`/stop/${selectedStop}`} />
						</>
					)}
					{!stopData && <NoDataLabel text="Nenhum dado encontrado" />}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</SafeAreaView>
	);

	//
}
