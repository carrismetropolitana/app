/* * */
import type { Stop } from '@carrismetropolitana/api-types/network';

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { MapView } from '@/components/map/MapView';
import { MapViewStyleStops } from '@/components/map/MapViewStyleStops';
import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Camera } from '@maplibre/maplibre-react-native';
import { ListItem } from '@rneui/themed';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { styles } from './styles';

/* * */

export default function StopsScreen() {
	//

	//
	// A.Setup variables

	const stopsContext = useStopsContext();
	const stopDetailContext = useStopsDetailContext();
	const stops = stopsContext.actions.getAllStopsGeoJsonFC();
	const locationContext = useLocationsContext();
	const insets = useSafeAreaInsets();

	const [camera, setCamera] = useState(locationContext.data.currentCords);
	const [selectedStop, setSelectedStop] = useState<'' | string>('');
	const [stopData, setStopData] = useState<Stop | undefined>(undefined);

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const stopMapDetailStyles = styles();

	//
	// B, Transform data

	useEffect(() => {
		if (locationContext.data.currentCords) {
			setCamera(locationContext.data.currentCords);
		}
	}, [locationContext.data.currentCords]);

	useEffect(() => {
		if (!selectedStop) return;

		const stopData = stopsContext.actions.getStopById(selectedStop);

		if (stopData) {
			setStopData(stopData);
			bottomSheetModalRef.current?.present();
		}
	}, [selectedStop]);

	//
	// C. Handle actions

	const handleStopPress = useCallback((stopId: string) => {
		setSelectedStop(stopId);
		stopDetailContext.actions.setActiveStopId(stopId);
	}, []);

	//
	// D. Render components

	return (
		<SafeAreaView style={stopMapDetailStyles.container}>
			<MapView mapStyle="map">
				<Camera animationDuration={1000} animationMode="flyTo" centerCoordinate={camera ? [camera.longitude, camera.latitude] : [0, 0]} zoomLevel={10} />
				{stops && <MapViewStyleStops onStopPress={handleStopPress} stopsData={stops as GeoJSON.FeatureCollection<GeoJSON.Point>} />}
			</MapView>
			<BottomSheetModal ref={bottomSheetModalRef} snapPoints={['70%']}>
				<BottomSheetScrollView contentContainerStyle={{ paddingBottom: 74 + insets.bottom }} style={stopMapDetailStyles.contentContainer}>
					{!stopData && <NoDataLabel text="Nenhum dado encontrado" />}
					{stopData && (
						<>
							<ListItem>
								<ListItem.Content>
									<Link href={`/stop/${stopData.id}`} style={{ width: '100%' }}>
										<View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
											<Svg fill="none" height={21} viewBox="0 0 20 21" width={20}>
												<Circle cx={10} cy={10.5} fill="#FFDD00"r={9} stroke="black" strokeWidth={2} />
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
							<StopDetailNextArrivals />
						</>
					)}
				</BottomSheetScrollView>
			</BottomSheetModal>

		</SafeAreaView>
	);

	//
}
