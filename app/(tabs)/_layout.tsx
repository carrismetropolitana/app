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
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

/* * */

export default function TabLayout() {
	//

	//
	// A. Setup variables

	const colorScheme = useColorScheme();
	const { t } = useTranslation('translation', { keyPrefix: 'layout.TabStack' });

	//
	// B. Render components

	return (
		<Tabs
			screenOptions={{
				headerBackButtonDisplayMode: 'default',
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
					title: `${t('Home')}`,
				}}
			/>

			<Tabs.Screen
				name="lines"
				options={{
					tabBarIcon: ({ color }) => (
						<IconArrowLoopRight color={color} size={28} />
					),
					title: `${t('Lines')}`,
				}}
			/>

			<Tabs.Screen
				name="stops"
				options={{
					tabBarIcon: ({ color }) => <IconBusStop color={color} size={28} />,
					title: `${t('Stops')}`,
				}}
			/>

			<Tabs.Screen
				name="more"
				options={{
					tabBarIcon: ({ color }) => <IconDots color={color} size={28} />,
					title: `${t('More')}`,
				}}
			/>
		</Tabs>
	);

	//
}
