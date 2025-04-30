import { Button, Icon } from '@rneui/themed';
import * as Location from 'expo-location';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';

interface Props {
	onCenterMap?: () => void
}

export function MapViewToolbar({ onCenterMap }: Props) {
	const { t } = useTranslation('map.toolbar');

	const handleOpenInGoogle = async () => {
		try {
			// Request location permissions
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(t('permission_denied'), t('location_permission_required'));
				return;
			}

			// Get current position
			const location = await Location.getCurrentPositionAsync({});
			const { latitude, longitude } = location.coords;

			// Open location in Google Maps
			const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
		}
		catch (error) {
			Alert.alert(t('error'), t('unable_to_fetch_location'));
		}
	};

	return (
		<View style={styles.container}>
			{onCenterMap && (
				<Button
					buttonStyle={styles.button}
					icon={<Icon color="#ffffff" name="center-focus-strong" type="material" />}
					onPress={onCenterMap}
				/>
			)}
			<Button
				buttonStyle={styles.button}
				icon={<Icon color="#ffffff" name="map" type="material" />}
				onPress={handleOpenInGoogle}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#2089dc',
		borderRadius: 5,
		padding: 10,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
	},
});
