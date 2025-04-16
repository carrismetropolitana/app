/* * */

import { Surface } from '@/components/common/layout/Surface';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { Button, Text } from '@rneui/themed';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native';

import { Section } from '../common/layout/Section';
import { WidgetCards } from '../widgets/WidgetCards';

/* * */

export default function HomeScreen() {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();

	//
	// B. Render Components

	return (
		<SafeAreaView
			style={{
				backgroundColor: themeContext.theme.mode === 'light'
					? themeContext.theme.lightColors?.background
					: themeContext.theme.darkColors?.background,
				flex: 1,
			}}
		>
			<Link href="/profile">
				<Button style={{
					borderColor: 'grey',
					borderRadius: 5,
					borderWidth: 3,
					marginBottom: 10,
					marginTop: 10,
				}}
				>
					<Text>Open profile</Text>
				</Button>
			</Link>
			<Surface>
				<Section>
					<WidgetCards type="lines" />
					<WidgetCards type="stops" />
				</Section>
			</Surface>
		</SafeAreaView>
	);

	//
}
