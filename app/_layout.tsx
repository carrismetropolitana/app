/* * */

import 'react-native-reanimated';
import '@/i18n';
import 'expo-dev-client';

/* * */

import { ThemedStatusBar } from '@/components/common/layout/ThemedStatusBar';
import { ThemeProvider } from '@/contexts/Theme.context';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ConfigProviders>
				<PrivacyProviders>
					<DataProviders>
						<ProfileProviders>
							<MapProviders>
								{/* <BottomSheetModalProvider> */}
								<ThemeProvider>
									<SafeAreaProvider>
										<ThemedStatusBar />
										<Stack>
											<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
										</Stack>
									</SafeAreaProvider>
								</ThemeProvider>
								{/* </BottomSheetModalProvider> */}
							</MapProviders>
						</ProfileProviders>
					</DataProviders>
				</PrivacyProviders>
			</ConfigProviders>
		</GestureHandlerRootView>
	);
}
