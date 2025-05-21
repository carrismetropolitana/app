import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { IconMap } from '@tabler/icons-react-native';
import * as Location from 'expo-location';
import React from 'react';
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
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const styles = StyleSheet.create({
		button: {
			borderColor: '#9696a0',
			borderRadius: 5,
			borderWidth: 1,
			backgroundColor: backgroundColor,
		},
		container: {
			position: 'absolute',
			bottom: 30,
			height: 65,
			left: 20,
			zIndex: 100,
			top: 30,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.6,
			shadowRadius: 4,
			elevation: 5,
			backgroundColor: backgroundColor,
			flexDirection: 'row',
			gap: 10,
			borderRadius: 10,
			justifyContent: 'flex-start',
			padding: 10,
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

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Button
				buttonStyle={styles.button}
				icon={<IconMap color="#9696a0" size={24} />}
				onPress={handleOpenInGoogle}
			/>
		</View>
	);

	//
}
