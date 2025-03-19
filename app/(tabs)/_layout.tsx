/* * */

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
	IconArrowLoopRight,
	IconBusStop,
	IconDots,
	IconUserCircle,
} from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

/* * */

export default function TabLayout() {
	//

	//
	// A. Setup variables

	const colorScheme = useColorScheme();

	//
	// B. Render components

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				tabBarBackground: TabBarBackground,
				tabBarButton: HapticTab,
				tabBarStyle: Platform.select({
					default: {},
					ios: {
						// Use a transparent background on iOS to show the blur effect
						backgroundColor: 'transparent',
						position: 'absolute',
					},
				}),
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					tabBarIcon: ({ color }) => <IconUserCircle color={color} size={28} />,
					title: 'Home',
				}}
			/>

			<Tabs.Screen
				name="lines"
				options={{
					tabBarIcon: ({ color }) => (
						<IconArrowLoopRight color={color} size={28} />
					),
					title: 'Linhas',
				}}
			/>

			<Tabs.Screen
				name="stops"
				options={{
					tabBarIcon: ({ color }) => <IconBusStop color={color} size={28} />,
					title: 'Paragens',
				}}
			/>

			<Tabs.Screen
				name="more"
				options={{
					tabBarIcon: ({ color }) => <IconDots color={color} size={28} />,
					title: 'Mais',
				}}
			/>
		</Tabs>
	);

	//
}
