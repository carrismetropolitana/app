/* * */

import { LineDetailContextProvider } from '@/contexts/LineDetail.context';
import { useSystemVariables } from '@/theme/global';
import { IconArrowLeft } from '@tabler/icons-react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';

/* * */

export default function Layout() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();
	const { line_id } = useLocalSearchParams<{ line_id: string }>();

	//
	// B. Render components

	return (
		<LineDetailContextProvider lineId={line_id}>
			<Stack screenOptions={{
				contentStyle: { backgroundColor: systemVariables.background[200] },
				headerShadowVisible: false,
				headerStyle: { backgroundColor: systemVariables.background[100] },
				headerTitleStyle: { color: systemVariables.text[100] },
			}}
			>
				<Stack.Screen
					name="[line_id]/index"
					options={{
						headerLeft: Platform.OS === 'android'
							? () => (
								<TouchableOpacity onPress={() => router.dismiss()} style={{ padding: 4 }}>
									<IconArrowLeft color={systemVariables.text[100]} size={28} />
								</TouchableOpacity>
							)
							: undefined,
						headerStyle: { backgroundColor: 'transparent' },
						headerTitle: '',
						headerTransparent: true,
					}}
				/>

				<Stack.Screen
					name="[line_id]/map"
					options={{
						headerBackButtonDisplayMode: 'minimal',
						headerStyle: { backgroundColor: 'transparent' },
						headerTitle: '',
						headerTransparent: true,
					}}
				/>

				<Stack.Screen
					name="[line_id]/pattern"
					options={{
						headerBackButtonDisplayMode: 'minimal',
						title: 'Pattern',
					}}
				/>
			</Stack>
		</LineDetailContextProvider>

	);

	//
}
