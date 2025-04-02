/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomMapView } from '../map/MapView';

/* * */

export default function HomeScreen() {
	const themeContext = useThemeContext();

	//

	//
	// A. Render componennts
	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					<CustomMapView />
					<Link href="/profile"><Text>Open profile</Text></Link>
					<Link href="/cookies"><Text>Open Cooks</Text></Link>
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
