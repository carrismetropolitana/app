/* * */

import 'react-native-reanimated';
import '@/i18n';
import 'expo-dev-client';
import ThemedStatusBar from '@/components/common/layout/ThemedStatusBar';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

const queryClient = new QueryClient();

/* * */
export default function RootLayout() {
	//

	//
	// B. Render components

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
													<ThemedStatusBar />
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
