import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useNotifications } from '@/contexts/Notifications.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';
import { SmartNotificationWidgetCard } from '../widgets/WidgetCards/SmartNotificationsWidgetCard';
import { SmartNotificationWidgetCardBody } from '../widgets/WidgetCards/SmartNotificationsWidgetCardBody';

export default function HomeScreen() {
	//

	//
	// A. Setup Variables
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();
	const notifcationsContext = useNotifications();
	const fcmToken = notifcationsContext.fcmToken;
	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText900 : theming.colorSystemText300;
	//
	// B. Fetch Data
	useEffect(() => {
		notifcationsContext.askForPermissions();
		notifcationsContext.subscribeToTopic('news');
		return () => {
			notifcationsContext.unsubscribeFromTopic('news');
		};
	}, []);

	useEffect(() => {
		if (notifcationsContext.response) {
			try {
				const responseObj = JSON.parse(notifcationsContext.response);
				const screen = responseObj.data?.screen as string | undefined;
				if (screen) {
					router.push(`/${screen}`);
				}
			}
			catch (e) {
				console.log('🎯 Tapped notification (raw):', notifcationsContext.response);
			}
		}
	}, [notifcationsContext.notification, notifcationsContext.response]);
	//
	// C. Render Components
	return (
		<View style={{ backgroundColor, flex: 1, paddingBottom: insets.bottom + 70 }}>
			<Header />
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 95 }}>
				{/* <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
					<Text>FCM Token:</Text>
					<Text style={{ marginVertical: 8 }} selectable> {fcmToken ?? 'A obter token...'} </Text>
					<Button
						onPress={() => notifcationsContext.subscribeToTopic('news')}
						title="Subscribe to News"
					/>
					<Button
						onPress={() => notifcationsContext.unsubscribeFromTopic('news')}
						title="Unsubscribe from News"
					/>
				</View> */}
				<FavoritesBar />
				<View style={{ paddingHorizontal: 20 }}>
					{/* <SmartNotificationWidgetCard /> */}
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
