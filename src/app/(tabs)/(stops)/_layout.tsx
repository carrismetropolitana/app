/* * */

import { useSystemVariables } from '@/theme/global';
import { Stack } from 'expo-router';

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
				name="index"
				options={{
					title: 'Paragens',
				}}
			/>
			<Stack.Screen
				name="(stop-modal)"
				options={{
					headerShown: false,
					presentation: 'modal',
				}}
			/>
		</Stack>
	);

	//
}
