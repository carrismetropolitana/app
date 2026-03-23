/* * */

import { StopDetailContextProvider } from '@/contexts/StopDetail.context';
import { useSystemVariables } from '@/theme/global';
import { Stack, useLocalSearchParams } from 'expo-router';

/* * */

export default function Layout() {
	//

	//
	// A. Setup variables

	const systemVariables = useSystemVariables();
	const { stop_id } = useLocalSearchParams<{ stop_id: string }>();

	//
	// B. Render components

	return (
		<StopDetailContextProvider stopId={stop_id}>
			<Stack screenOptions={{
				contentStyle: { backgroundColor: systemVariables.background[200] },
				headerShadowVisible: false,
				headerStyle: { backgroundColor: systemVariables.background[100] },
				headerTitleStyle: { color: systemVariables.text[100] },
			}}
			>
				<Stack.Screen
					name="[stop_id]/index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</StopDetailContextProvider>

	);

	//
}
