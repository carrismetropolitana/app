import { MapContext } from '@/contexts/Map.context';
import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { IconCurrentLocation, IconLocationFilled, IconMap, IconSatellite } from '@tabler/icons-react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, StyleSheet, View } from 'react-native';

interface Props {
	cameraCenter?: [number, number]
	onCenterMap?: () => void
}

export function MapViewToolbar({ cameraCenter, onCenterMap }: Props) {
	const { mapInstance } = useContext(MapContext);
	//

	//
	// A. Setup variables

	const { t } = useTranslation('map.toolbar');
	const themeContext = useThemeContext();
	const mapOptionsContext = useMapOptionsContext();
	const stopDetailsContext = useStopsDetailContext();
	const [stopLat, setStopLat] = useState(stopDetailsContext.data.stop?.lat);
	const [stopLon, setStopLon] = useState(stopDetailsContext.data.stop?.lon);
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const styles = StyleSheet.create({
		button: {
			backgroundColor: backgroundColor,
			borderRadius: 999,
			height: 45,
		},
		container: {
			flexDirection: 'column',
			gap: 15,
			padding: 20,
			position: 'absolute',
			right: 0,
			top: '65%',
			zIndex: 100,
		},
	});

	//
	// B. Handle actions

	useEffect(() => {
		if (!stopDetailsContext.data.stop || stopDetailsContext.data.stop.id === '') {
			setStopLat(undefined);
			setStopLon(undefined);
			return;
		}
		setStopLat(stopDetailsContext.data.stop.lat);
		setStopLon(stopDetailsContext.data.stop.lon);
	}, [stopDetailsContext.data.stop]);

	const handleOpenExternalLocation = async () => {
		try {
			let url = '';
			const location = await Location.getCurrentPositionAsync();
			const { latitude, longitude } = location.coords;
			if (stopLat && stopLon) {
				url = `https://www.google.com/maps?q=${stopLat},${stopLon}&z=10`;
			}
			else {
				if (cameraCenter && cameraCenter.length === 2) {
					url = `https://www.google.com/maps?q=${cameraCenter[1]},${cameraCenter[0]}&z=16`;
				}
				else if (mapInstance.current && mapInstance.current.getCenter) {
					const center = await mapInstance.current.getCenter();
					url = `https://www.google.com/maps?q=${center[1]},${center[0]}&z=16`;
				}
				else {
					url = `https://www.google.com/maps?q=${latitude},${longitude}&z=10`;
				}
			}
			Linking.openURL(url);
		}
		catch (error) {
			Alert.alert(t('error'), t('unable_to_fetch_location'));
		}
	};

	const handleCenterOnUser = () => {
		if (onCenterMap) {
			onCenterMap();
		}
	};

	const handleToggleMapType = () => {
		if (mapOptionsContext?.data?.style && mapOptionsContext.actions?.setStyle) {
			mapOptionsContext.actions.setStyle(
				mapOptionsContext.data.style === 'map' ? 'satellite' : 'map',
			);
		}
	};

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Button
				accessibilityLabel={t('center_on_user')}
				buttonStyle={styles.button}
				icon={<IconCurrentLocation color="#006EFF" size={24} />}
				onPress={handleCenterOnUser}
			/>
			<Button
				accessibilityLabel={t('toggle_map_type')}
				buttonStyle={styles.button}
				icon={mapOptionsContext?.data?.style === 'map' ? <IconMap color="#006EFF" size={24} /> : <IconSatellite color="#006EFF" size={24} />}
				onPress={handleToggleMapType}
			/>
			<Button
				accessibilityLabel={t('open_in_google_maps')}
				buttonStyle={styles.button}
				icon={<IconLocationFilled color="#006EFF" fill="#006EFF" size={24} />}
				onPress={handleOpenExternalLocation}
			/>
		</View>
	);

	//
}
