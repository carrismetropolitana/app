/* * */

import { LineDetailContextProvider } from '@/contexts/LineDetail.context';
import { useSystemVariables } from '@/theme/global';
import { Stack, useLocalSearchParams } from 'expo-router';

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
						headerStyle: { backgroundColor: 'transparent' },
						headerTitle: '',
						headerTransparent: true,
					}}
				/>

				<Stack.Screen
					name="[line_id]/map"
					options={{
						headerBackButtonDisplayMode: 'minimal',
						title: 'Mapa',
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
