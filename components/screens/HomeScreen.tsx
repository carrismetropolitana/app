import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';
import { Button } from '@rn-vui/themed';
import { theming } from '@/theme/Variables';
import { Link } from 'expo-router';

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();

	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText900 : theming.colorSystemText300;

	return (
		<View style={{ backgroundColor, flex: 1, paddingBottom: insets.bottom + 100 }}>
			<Header />
			<ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 95 }}>
				<FavoritesBar />
				<View style={{ paddingHorizontal: 20 }}>
					<Link href='/vehicle/41|724'>
					HEYYYYYYY</Link>
					<WidgetCards />
				</View>
				<Link href='/profile' asChild>
					<Button buttonStyle={{ borderRadius: 999, flexDirection: 'row', width: '30%', alignSelf: 'center', backgroundColor: buttonBackgroundColor }} titleStyle={{ color: titleColor, fontWeight: theming.fontWeightSemibold as '600', fontSize: theming.fontSizeMuted }} title={'Personalizar'} containerStyle={{ backgroundColor: backgroundColor, paddingTop: 10 }} />
				</Link>
			</ScrollView>
		</View>
	);
}
