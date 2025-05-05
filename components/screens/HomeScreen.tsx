import { Header } from '@/components/common/layout/Header';
import { useThemeContext } from '@/contexts/Theme.context';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();

	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			<Header />
			<View style={{ flex: 1, paddingHorizontal: 20, paddingTop: insets.top + 100 }}>
				<Link href="/stop/012215">
					<Text>012215</Text>
				</Link>
				<WidgetCards type="lines" />
				<WidgetCards type="stops" />
			</View>
		</View>
	);
}
