/* * */

import '@/i18n';
import 'react-native-reanimated';
import 'expo-dev-client';

/* * */

import { TabBar } from '@/components/layout/tabs/TabBar';
import { OfflineScreen } from '@/components/OfflineScreen';
import { AllProviders } from '@/providers/all-providers';
import { useNetInfo } from '@react-native-community/netinfo';

/* * */

export default function RootLayout() {
	//

	//
	// A. Setup variables

	const netInfo = useNetInfo();

	//
	// B. Render components

	if (netInfo.isConnected === false) {
		return <OfflineScreen />;
	}

	return (
		<AllProviders>
			<TabBar />
		</AllProviders>
	);

	//
}
