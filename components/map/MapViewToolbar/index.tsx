import { useMapOptionsContext } from '@/contexts/MapOptions.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { IconExternalLink, IconMap, IconSatellite, IconTarget } from '@tabler/icons-react-native';
import * as Location from 'expo-location';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, StyleSheet, View } from 'react-native';

interface Props {
	onCenterMap?: () => void
}

export function MapViewToolbar({ onCenterMap }: Props) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('map.toolbar');
	const themeContext = useThemeContext();
	const mapOptionsContext = useMapOptionsContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const styles = StyleSheet.create({
		button: {
			backgroundColor: backgroundColor,
			borderColor: '#9696a0',
			borderRadius: 5,
			borderWidth: 1,
		},
		container: {
			backgroundColor: backgroundColor,
			borderRadius: 10,
			bottom: 30,
			elevation: 5,
			flexDirection: 'row',
			gap: 10,
			height: 65,
			justifyContent: 'flex-start',
			left: 20,
			padding: 10,
			position: 'absolute',
			shadowColor: '#000',
			shadowOffset: { height: 2, width: 0 },
			shadowOpacity: 0.6,
			shadowRadius: 4,
			top: 30,
			zIndex: 100,
		},
	});

	//
	// B. Handle actions

	const handleOpenInGoogle = async () => {
		try {
			const location = await Location.getCurrentPositionAsync();
			const { latitude, longitude } = location.coords;
			const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=10`;
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

	useEffect(() => {
		console.log('Map style changed:', mapOptionsContext?.data?.style);
	}, [mapOptionsContext?.data?.style]);
	return (
		<View style={styles.container}>
			<Button
				accessibilityLabel={t('center_on_user')}
				buttonStyle={styles.button}
				icon={<IconTarget color="#9696a0" size={24} />}
				onPress={handleCenterOnUser}
			/>
			<Button
				accessibilityLabel={t('toggle_map_type')}
				buttonStyle={styles.button}
				icon={mapOptionsContext?.data?.style === 'map' ? <IconMap color="#9696a0" size={24} /> : <IconSatellite color="#9696a0" size={24} />}
				onPress={handleToggleMapType}
			/>
			<Button
				accessibilityLabel={t('open_in_google_maps')}
				buttonStyle={styles.button}
				icon={<IconExternalLink color="#9696a0" size={24} />}
				onPress={handleOpenInGoogle}
			/>
		</View>
	);

	//
}
