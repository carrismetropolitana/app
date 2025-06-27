import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useNotifications } from '@/contexts/Notifications.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';

export default function HomeScreen() {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();
	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText900 : theming.colorSystemText300;

	//
	// B. Render Components

	return (
		<View style={{ backgroundColor, flex: 1, paddingBottom: insets.bottom + 100 }}>
			<Header />
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 95 }}>
				<FavoritesBar />
				<View style={{ paddingHorizontal: 20 }}>
					<WidgetCards />
				</View>
				<Button
					onPress={() => router.push('/profile')}
					title="Personalizar"
					buttonStyle={{
						alignSelf: 'center',
						backgroundColor: buttonBackgroundColor,
						borderRadius: 999,
						flexDirection: 'row',
						marginBottom: 20,
						width: '30%',
					}}
					containerStyle={{
						backgroundColor: backgroundColor,
						paddingTop: 10,
					}}
					titleStyle={{
						color: titleColor,
						fontSize: theming.fontSizeMuted,
						fontWeight: theming.fontWeightSemibold as '600',
					}}
				/>
			</ScrollView>
		</View>
	);

	//
}
