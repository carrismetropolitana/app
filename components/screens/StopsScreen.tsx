import type { Stop } from '@carrismetropolitana/api-types/network';

import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Camera } from '@maplibre/maplibre-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { NoDataLabel } from '../common/layout/NoDataLabel';
import { MapView } from '../map/MapView';
import { MapViewStyleStops } from '../map/MapViewStyleStops';

export default function StopsScreen() {
	const stopsContext = useStopsContext();
	const themeContext = useThemeContext();
	const stops = stopsContext.actions.getAllStopsGeoJsonFC();
	const locationContext = useLocationsContext();

	const [camera, setCamera] = useState(locationContext.data.currentCords);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [selectedStop, setSelectedStop] = useState<'' | string>('');
	const [stopData, setStopData] = useState<Stop | undefined>(undefined);

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

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

	const handleStopPress = useCallback((stopId: string) => {
		setSelectedStop(stopId);
	}, []);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: themeContext.theme.mode === 'light'
				? themeContext.theme.lightColors?.background
				: themeContext.theme.darkColors?.background,
			flex: 1,
			height: '100%',
			width: '100%',
		},
		contentContainer: {
			flex: 1,
		},
		stopHeader: {
			backgroundColor: themeContext.theme.mode === 'light'
				? themeContext.theme.lightColors?.background
				: themeContext.theme.darkColors?.background,
			flexDirection: 'row',
		},
		stopName: {
			color: themeContext.theme.mode === 'light'
				? theming.colorSystemText100
				: theming.colorSystemText400,
			fontSize: theming.fontSizeText,
			fontWeight: theming.fontWeightHeading as '700',
		},
	});

	return (
		<SafeAreaView style={styles.container}>
			<MapView mapStyle="map">
				<Camera
					animationDuration={1000}
					animationMode="flyTo"
					centerCoordinate={camera ? [camera.longitude, camera.latitude] : [0, 0]}
					zoomLevel={10}
				/>

				{stops && (
					<MapViewStyleStops
						onStopPress={handleStopPress}
						stopsData={stops as GeoJSON.FeatureCollection<GeoJSON.Point>}
					/>
				)}
			</MapView>
			<BottomSheetModal ref={bottomSheetModalRef} index={0} snapPoints={['60%']}>
				<BottomSheetView style={styles.contentContainer}>
					{!stopData && <NoDataLabel text="Nenhum dado encontrado" />}
					{stopData && (
						<>
							<View style={styles.stopHeader}>
								<Text style={styles.stopName}>{stopData.long_name}</Text>
								<View>
									<Text>{stopData.id}</Text>
									<Text>{stopData.municipality_id}</Text>
								</View>
							</View>
							<View>
								<Text>{t('heading')}</Text>
							</View>

						</>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</SafeAreaView>
	);
}
