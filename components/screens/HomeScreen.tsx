import FavoritesBar from '@/components/common/FavoritesBar';
import { Header } from '@/components/common/layout/Header';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Button } from '@rn-vui/themed';
import { router } from 'expo-router';
import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WidgetCards } from '../widgets/WidgetCards';

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const insets = useSafeAreaInsets();

	const backgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
	const buttonBackgroundColor = themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary;
	const titleColor = themeContext.theme.mode === 'light' ? theming.colorSystemText900 : theming.colorSystemText300;

	return (
		<View style={{ backgroundColor, paddingBottom: insets.bottom + 70 }}>
			<Header />
			<ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: insets.top + 95 }}>
				<FavoritesBar />
				<View style={{ paddingHorizontal: 20 }}>
					<WidgetCards />
				</View>
				{/* <Link href='/profile' asChild> */}
				<Button buttonStyle={{ alignSelf: 'center', backgroundColor: buttonBackgroundColor, borderRadius: 999, flexDirection: 'row', marginBottom: 20, width: '30%' }} containerStyle={{ backgroundColor: backgroundColor, paddingTop: 10 }} onPress={() => router.push('/profile')} title="Personalizar" titleStyle={{ color: titleColor, fontSize: theming.fontSizeMuted, fontWeight: theming.fontWeightSemibold as '600' }} />
				{/* </Link> */}
			</ScrollView>
		</View>
	);
}
