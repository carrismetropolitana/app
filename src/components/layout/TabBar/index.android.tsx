/* * */

import { useSystemVariables } from '@/theme/global';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { type ColorValue, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function TabBar() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const { t } = useTranslation();

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
				tabBarItemStyle: styles.item,
				tabBarShowLabel: false,
				tabBarStyle: styles.container,
			}}
		>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarAccessibilityLabel: t($ => $._app.sitemap['(tabs)/home'].title),
					tabBarIcon: ({ color, focused }: { color: ColorValue, focused: boolean, size: number }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconUserCircle color={focused ? 'black' : color} size={30} />
						</View>
					),
					tabBarLabel: t($ => $._app.sitemap['(tabs)/home'].title),
				}}
			/>
			<Tabs.Screen
				name="(lines)"
				options={{
					tabBarAccessibilityLabel: t($ => $._app.sitemap['(tabs)/lines'].title),
					tabBarIcon: ({ color, focused }: { color: ColorValue, focused: boolean, size: number }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconArrowLoopRight color={focused ? 'black' : color} size={30} />
						</View>
					),
					tabBarLabel: t($ => $._app.sitemap['(tabs)/lines'].title),
				}}
			/>
			<Tabs.Screen
				name="(stops)"
				options={{
					tabBarAccessibilityLabel: t($ => $._app.sitemap['(tabs)/stops'].title),
					tabBarIcon: ({ color, focused }: { color: ColorValue, focused: boolean, size: number }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconMap color={focused ? 'black' : color} size={30} />
						</View>
					),
					tabBarLabel: t($ => $._app.sitemap['(tabs)/stops'].title),
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					tabBarAccessibilityLabel: t($ => $._app.sitemap['(tabs)/more'].title),
					tabBarIcon: ({ color, focused }: { color: ColorValue, focused: boolean, size: number }) => (
						<View onTouchStart={handleTouchStart} style={[styles.button, focused && styles.buttonIsFocused]}>
							<IconDots color={focused ? 'black' : color} size={30} />
						</View>
					),
					tabBarLabel: t($ => $._app.sitemap['(tabs)/more'].title),
				}}
			/>
		</Tabs>
	);

	//
}
