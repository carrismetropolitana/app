/* * */

import '@/i18n';
import 'react-native-reanimated';
import 'expo-dev-client';

/* * */

import { AppSplashScreen } from '@/components/layout/AppSplashScreen';
import { OfflineScreen } from '@/components/layout/OfflineScreen';
import { AllProviders } from '@/providers/all-providers';
import { useSystemVariables } from '@/theme/global';
import { useNetInfo } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';

/* * */

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: 'index',
};

/* * */

export default function RootLayout() {
	//

	//
	// A. Setup variables

	const netInfo = useNetInfo();

	const systemVariables = useSystemVariables();

	//
	// B. Render components

	if (!netInfo.isConnected) {
		return <OfflineScreen />;
	}

	return (
		<AppSplashScreen>
			<AllProviders>
				<Stack screenOptions={{
					contentStyle: { backgroundColor: systemVariables.background[200] },
					headerShown: false,
					headerStyle: { backgroundColor: systemVariables.background[100] },
					headerTitleStyle: { color: systemVariables.text[100] },
				}}
				/>
			</AllProviders>
		</AppSplashScreen>
	);

	//
}
