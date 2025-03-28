/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export default function HomeScreen() {
	const themeContext = useThemeContext();
	const profileContext = useProfileContext();

	//
	//
	// A. Render componennts
	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					{/* r<CustomMapView /> */}
					<Link href="/profile"><Text>Open profile</Text></Link>

					<Text>{profileContext.counters.favorite_lines}</Text>
					<Text>{profileContext.counters.favorite_stops}</Text>
					<Text>{profileContext.data.favorite_lines || 'Nenhuma linha'}</Text>
					<Text>{profileContext.data.favorite_stops || 'Nehumna paragem'}</Text>
					<Text>{profileContext.flags.is_enabled ? 'Ativo' : 'Inativo'}</Text>

					<Link href="/cookies"><Text>Open Cooks</Text></Link>

				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
