/* * */

import { ConsentPopup } from '@/components/common/ConsentDialog';
import { HapticTab } from '@/components/HapticTab';
import OfflineScreen from '@/components/OfflineScreen';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useLinesContext } from '@/contexts/Lines.context';
import { useNotifications } from '@/contexts/Notifications.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { useNetInfo } from '@react-native-community/netinfo';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, Tabs } from 'expo-router';
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

	const stopContext = useStopsContext();
	const linesContext = useLinesContext();
	const profileContext = useProfileContext();

	const [loaded] = useFonts({
		// eslint-disable-next-line
		Inter: require('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
		// eslint-disable-next-line
		SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
	});

	//
	// B. Transform data

	useEffect(() => {
		if (loaded && !stopContext.flags.is_loading && !linesContext.flags.is_loading && !profileContext.flags.is_loading) {
			SplashScreen.hideAsync();
		}
	}, [loaded, stopContext.flags.is_loading, linesContext.flags.is_loading, profileContext.flags.is_loading]);

	useEffect(() => {
		notificationsContext.actions.askForPermissions();
	}, []);

	//
	// C. Render components

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
									backgroundColor: 'transparent',
									borderTopColor: borderColor,
									height: 74 + insets.bottom,
									paddingBottom: 30,
									paddingTop: 20,
									position: 'absolute',
								},
								default: {
									height: 74 + insets.bottom,
									paddingBottom: 30,
									paddingTop: 20,
								},
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
