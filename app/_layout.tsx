/* * */

import NetworkOffline from '@/components/common/NetworkOfflineBanner';
import 'react-native-reanimated';
import '@/i18n';
import 'expo-dev-client';
import { NotificationsProvider } from '@/contexts/Notifications.context';
import { ThemeProvider } from '@/contexts/Theme.context';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { StrictMode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

const queryClient = new QueryClient();

/* * */

SplashScreen.preventAutoHideAsync();

/* * */
export default function RootLayout() {
	//

	//
	// A. Render components

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NotificationsProvider>
				<ConfigProviders>
					<PrivacyProviders>
						<DataProviders>
							<ProfileProviders>
								<MapProviders>
									<BottomSheetModalProvider>
										<QueryClientProvider client={queryClient}>
											<ThemeProvider>
												<SafeAreaProvider>
													<NetworkOffline />
													<StatusBar backgroundColor="transparent" style="auto" translucent />
													<Stack>
														<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
													</Stack>
												</SafeAreaProvider>
											</ThemeProvider>
										</QueryClientProvider>
									</BottomSheetModalProvider>
								</MapProviders>
							</ProfileProviders>
						</DataProviders>
					</PrivacyProviders>
				</ConfigProviders>
			</NotificationsProvider>
		</GestureHandlerRootView>
	);

	//
}
