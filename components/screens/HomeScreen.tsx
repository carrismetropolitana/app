/* * */
import { Section } from '@/components/common/layout/Section';
import { Surface } from '@/components/common/layout/Surface';
import { CustomMapView } from '@/components/map/MapView';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* * */

export default function HomeScreen() {
	//

	//
	// A. Render componennts

	return (
		<SafeAreaView>
			<Surface>
				<Section heading="THIS IS A TEST" subheading="THIS IS A SUBHEADING TEXT" withPadding>
					{/* <View style={{ height: '100%'r, width: '100%' }}>
						<CustomMapView />
					</View> */}
					<Link href="/profile">Open profile</Link>
					<Text>Some text</Text>
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
