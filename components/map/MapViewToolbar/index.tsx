import { Button } from '@rneui/themed';
import { IconMap } from '@tabler/icons-react-native';
import * as Location from 'expo-location';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, StyleSheet, View } from 'react-native';

interface Props {
	onCenterMap?: () => void
}

export function MapViewToolbar({ onCenterMap }: Props) {
	const { t } = useTranslation('map.toolbar');

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

	return (
		<View style={styles.container}>
			<Button
				buttonStyle={styles.button}
				icon={<IconMap color="#9696a0" size={24} />}
				onPress={handleOpenInGoogle}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		borderColor: '#9696a0',
		borderRadius: 5,
		borderWidth: 1,
		color: '#FFFFFF',
		padding: 10,
	},
	container: {
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'flex-start',
		padding: 10,
	},
});
