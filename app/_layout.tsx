/* * */

import '@/i18n';
import 'react-native-reanimated';
import 'expo-dev-client';

/* * */

import { HapticTab } from '@/components/HapticTab';
import { OfflineScreen } from '@/components/OfflineScreen';
import { AllProviders } from '@/providers/all-providers';
import { useSystemVariables } from '@/theme/global';
import { useNetInfo } from '@react-native-community/netinfo';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { useStyles } from '../theme/styles';

/* * */

export default function RootLayout() {
	//

	//
	// A. Setup variables

	const netInfo = useNetInfo();

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	if (netInfo.isConnected === false) {
		return <OfflineScreen />;
	}

	return (
		<AllProviders>
			<Tabs
				screenOptions={{
					headerShown: false,
					sceneStyle: { backgroundColor: systemVariables.background[200] },
					tabBarActiveTintColor: systemVariables.text[100],
					tabBarButton: HapticTab,
					tabBarShowLabel: false,
					tabBarStyle: styles.tabBar,
				}}
			>
				<Tabs.Screen
					name="(home)"
					options={{
						tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
							<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
								<IconUserCircle color={focused ? 'black' : color} size={26} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="lines"
					options={{
						tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
							<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
								<IconArrowLoopRight color={focused ? 'black' : color} size={26} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="stops"
					options={{
						tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
							<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
								<IconMap color={focused ? 'black' : color} size={26} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="more"
					options={{
						tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
							<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
								<IconDots color={focused ? 'black' : color} size={26} />
							</View>
						),
					}}
				/>
				<Tabs.Screen
					name="vehicles"
					options={{
						href: null,
						tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
							<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
								<IconDots color={focused ? 'black' : color} size={26} />
							</View>
						),
					}}
				/>
			</Tabs>
		</AllProviders>
	);

	//
}
