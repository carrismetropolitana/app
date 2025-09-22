/* * */

import { HapticTab } from '@/components/HapticTab';
import { OfflineScreen } from '@/components/OfflineScreen';
import { useSystemVariables } from '@/theme/global';
import { useNetInfo } from '@react-native-community/netinfo';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { Tabs, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useStyles } from '../../theme/styles';

/* * */

export default function Layout() {
	//

	//
	// A. Setup variables

	const netInfo = useNetInfo();

	const navigation = useNavigation();

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: 'here',
		});
	}, [navigation]);

	//
	// B. Render components

	if (netInfo.isConnected === false) {
		return <OfflineScreen />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: systemVariables.text[100],
				tabBarButton: HapticTab,
				tabBarShowLabel: false,
				tabBarStyle: styles.tabBar,
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
							<IconUserCircle color={color} size={26} />
						</View>
					),
					title: 'Home',
				}}
			/>
			<Tabs.Screen
				name="lines"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
							<IconArrowLoopRight color={color} size={26} />
						</View>
					),
					title: 'Lines',
				}}
			/>
			<Tabs.Screen
				name="stops"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
							<IconMap color={color} size={26} />
						</View>
					),
					title: 'Stops',
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
						<View style={[styles.iconWrapper, focused && styles.iconWrapperIsFocused]}>
							<IconDots color={color} size={26} />
						</View>
					),
					title: 'More',
				}}
			/>
		</Tabs>
	);

	//
}
