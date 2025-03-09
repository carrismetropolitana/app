import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
	IconArrowLoopRight,
	IconBusStop,
	IconDots,
	IconUserCircle,
} from "@tabler/icons-react-native";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						backgroundColor: "transparent",
						position: "absolute",
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <IconUserCircle size={28} color={color} />,
				}}
			/>

			<Tabs.Screen
				name="lines"
				options={{
					title: "Linhas",
					tabBarIcon: ({ color }) => (
						<IconArrowLoopRight size={28} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="stops"
				options={{
					title: "Paragens",
					tabBarIcon: ({ color }) => <IconBusStop size={28} color={color} />,
				}}
			/>

			<Tabs.Screen
				name="more"
				options={{
					title: "Mais",
					tabBarIcon: ({ color }) => <IconDots size={28} color={color} />,
				}}
			/>
		</Tabs>
	);
}
