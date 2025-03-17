/* * */
import { Surface } from '@/components/common/layout/Surface';
import { CustomMapView } from '@/components/map/MapView';
import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export default function HomeScreen() {
	return (
		<SafeAreaView>
			<Surface variant="success">
				<Text>Teste de Surface</Text>
			</Surface>
			<CustomMapView />
			<Link href="/profile">Open profile</Link>

		</SafeAreaView>
	);
}
