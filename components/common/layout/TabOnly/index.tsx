import { HapticTab } from '@/components/HapticTab';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { IconArrowLoopRight, IconDots, IconMap, IconUserCircle } from '@tabler/icons-react-native';
import { router, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarOnly() {
	//

	//
	// A. Setup Variables

	const insets = useSafeAreaInsets();
	const themeContext = useThemeContext();
	const pathname = usePathname();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;
	const borderColor = themeContext.theme.mode === 'light' ? theming.colorSystemBorder100 : theming.colorSystemBorderDark200;
	const icons = { home: IconUserCircle, lines: IconArrowLoopRight, more: IconDots, stops: IconMap };
	const isLinesDetail = pathname.startsWith('/line/');
	const isStopsDetail = pathname.startsWith('/stop/');
	const isHomeOverride = ['/addFavoriteLine', '/addFavoriteStop', '/addSmartNotification', '/profile', '/profileEdit'].includes(pathname);
	const tabs = [{ name: 'home', route: '/home' }, { name: 'lines', route: '/lines' }, { name: 'stops', route: '/stops' }, { name: 'more', route: '/more' }];

	//
	// B. Render Components

	return (
		<View style={[styles.container, { backgroundColor, borderTopColor: borderColor, height: 74 + insets.bottom, paddingBottom: 30, paddingTop: 20 }]}>
			{tabs.map((tab) => {
				const IconComponent = icons[tab.name];

				const focused = (tab.name === 'home' && isHomeOverride) || (tab.name === 'lines' && (pathname === tab.route || isLinesDetail)) || (tab.name === 'stops' && (pathname === tab.route || isStopsDetail)) || (tab.name === 'more' && pathname === tab.route);

				return (
					<HapticTab key={tab.name} onPress={() => router.push(tab.route)} style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
						<IconComponent
							color={focused && themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : theming.colorSystemBackgroundDark300}
							size={24}
						/>
					</HapticTab>
				);
			})}
		</View>
	);

	//
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	iconWrapper: {
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		width: 40,
	},
	iconWrapperActive: {
		backgroundColor: theming.colorBrand,
		borderRadius: 22,
	},
});
