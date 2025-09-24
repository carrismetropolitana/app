/* * */

import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function TabBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	//
	// B. Handle actions

	const handleTouchStart = async () => {
		await Haptics.selectionAsync();
	};

	//
	// C. Render components

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				sceneStyle: { backgroundColor: systemVariables.background[200] },
				tabBarActiveTintColor: systemVariables.text[100],
				tabBarShowLabel: false,
				tabBarStyle: styles.container,
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconUserCircle color={focused ? 'black' : color} size={30} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="lines"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconArrowLoopRight color={focused ? 'black' : color} size={30} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="stops"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconMap color={focused ? 'black' : color} size={30} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconDots color={focused ? 'black' : color} size={30} />
						</View>
					),
				}}
			/>
		</Tabs>
	);

	//
}
