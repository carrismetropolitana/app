/* * */

import { ConsentPopup } from '@/components/common/ConsentDialog';
import { HapticTab } from '@/components/HapticTab';
import OfflineScreen from '@/components/OfflineScreen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useNotifications } from '@/contexts/Notifications.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { useNetInfo } from '@react-native-community/netinfo';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export default function TabLayout() {
	//

	//
	// A. Setup Variables

	const notificationsContext = useNotifications();
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();
	const netInfo = useNetInfo();
	const icons = { home: IconUserCircle, lines: IconArrowLoopRight, more: IconDots, stops: IconMap };
	const borderColor = themeContext.theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight200 : theming.colorSystemBackgroundDark200;

	const styles = StyleSheet.create({
		iconWrapper: {
			alignItems: 'center',
			color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.grey0 : themeContext.theme.darkColors?.grey0,
			height: 40,
			justifyContent: 'center',
			width: 40,
		},
		iconWrapperActive: {
			backgroundColor: theming.colorBrand,
			borderRadius: 22,
		},
	});

	useEffect(() => {
		notificationsContext.askForPermissions();
	}, []);

	//
	// B. Render components

	return (
		<>
			{netInfo.isConnected === false ? (
				<OfflineScreen />
			) : (
				<>
					<ConsentPopup />
					<Tabs
						screenOptions={({ route }) => ({
							headerShown: false,
							headerStyle: { backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background },
							tabBarActiveTintColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : theming.colorSystemBackgroundDark300,
							tabBarBackground: TabBarBackground,
							tabBarButton: HapticTab,
							tabBarIcon: ({ color, focused }) => {
								const IconComponent = icons[route.name];
								return (
									<View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
										<IconComponent color={color} size={24} />
									</View>
								);
							},
							tabBarShowLabel: false,
							tabBarStyle: Platform.select({
								android: {
									backgroundColor: backgroundColor,
									borderTopColor: borderColor,
									height: 74 + insets.bottom,
									paddingBottom: 30,
									paddingTop: 20,
									position: 'absolute',
								},
								default: { height: 74 + insets.bottom, paddingBottom: 30, paddingTop: 20 },
								ios: {
									backgroundColor: 'transparent',
									borderTopColor: borderColor,
									height: 74 + insets.bottom,
									paddingBottom: 30,
									paddingTop: 20,
									position: 'absolute',
								},
							}),
						})}
					>
						<Tabs.Screen name="home" />
						<Tabs.Screen name="lines" />
						<Tabs.Screen name="stops" />
						<Tabs.Screen name="more" />
					</Tabs>
				</>
			)}
		</>
	);
}
