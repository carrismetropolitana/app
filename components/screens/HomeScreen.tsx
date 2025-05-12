import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();

	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			<Header />
			<ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: insets.top + 100 }}>
				<FavoritesBar />
				<WidgetCards />
			</ScrollView>
		</View>
	);
}
