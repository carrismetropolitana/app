/* * */

import { useSystemVariables } from '@/theme/global';
import { IconArrowLeft } from '@tabler/icons-react-native';
import { router, Stack } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';

/* * */

export default function Layout() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();

	//
	// B. Render components

	return (
		<Stack screenOptions={{
			contentStyle: { backgroundColor: systemVariables.background[200] },
			headerShadowVisible: false,
			headerStyle: { backgroundColor: systemVariables.background[100] },
			headerTitleStyle: { color: systemVariables.text[100] },
		}}
		>
			<Stack.Screen
				name="[vehicle_id]/index"
				options={{
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.dismiss()} style={{ padding: 4 }}>
							<IconArrowLeft color={systemVariables.text[100]} size={28} />
						</TouchableOpacity>
					),
					headerShown: Platform.OS === 'android',
					headerTitle: '',
				}}
			/>
		</Stack>

	);

	//
}
