/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useThemeContext } from '@/contexts/Theme.context';
import { Button } from '@rneui/themed';
import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export default function HomeScreen() {
	const themeContext = useThemeContext();

	//
	//
	// A. Render componennts
	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background }}>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					{/* r<CustomMapView /> */}

					<Text style={{ color: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.primary : themeContext.theme.darkColors?.primary, fontSize: 18 }}>
						This text uses the primary color!
					</Text>
					<Button onPress={themeContext.toggleTheme} title="Toggle Theme" />
					<Text>{themeContext.theme.mode}</Text>

					<Link href="/profile">Open profile</Link>
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
