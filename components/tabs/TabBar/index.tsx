/* * */

import { TabBarButton } from '@/components/tabs/TabBarButton';
import { TabBarHaptic } from '@/components/tabs/TabBarHaptic';
import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconBus, IconDots, IconError404, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';

import { useStyles } from './styles';

/* * */

export function TabBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Render components

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				sceneStyle: { backgroundColor: systemVariables.background[200] },
				tabBarActiveTintColor: systemVariables.text[100],
				tabBarButton: TabBarHaptic,
				tabBarShowLabel: false,
				tabBarStyle: styles.container,
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconUserCircle color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
			<Tabs.Screen
				name="lines"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconArrowLoopRight color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
			<Tabs.Screen
				name="stops"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconMap color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconDots color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
			<Tabs.Screen
				name="vehicles"
				options={{
					href: null,
					// presentation: 'modal',
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconBus color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
			<Tabs.Screen
				name="+not-found"
				options={{
					href: null,
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<TabBarButton focused={focused}>
							<IconError404 color={focused ? 'black' : color} size={26} />
						</TabBarButton>
					),
				}}
			/>
		</Tabs>
	);

	//
}
