/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { CustomMapView } from '@/components/map/MapView';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export default function HomeScreen() {
	//
	//
	// A. Render componennts
	return (
		<SafeAreaView>
			<Surface>
				<Section heading="Bem-Vindo" subheading="Hoje o tempo está limpo" withPadding>
					<CustomMapView />
					<Link href="/profile">Open profile</Link>
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
