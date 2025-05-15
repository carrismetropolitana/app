/* * */
import { ThemeProvider } from '@/contexts/Theme.context';
import 'react-native-reanimated';
import { ConfigProviders } from '@/providers/config-providers';
import '@/i18n';
import 'expo-dev-client';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

/* * */

const queryClient = new QueryClient();

/* * */

SplashScreen.preventAutoHideAsync();

/* * */
export default function RootLayout() {
	//

	//
	// A. Setup variables

	const [loaded] = useFonts({
		// eslint-disable-next-line
		Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'), 
		// eslint-disable-next-line
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),  
	});

	//
	// B. Fetch data

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	//
	// C. Render components

	return (
		<GestureHandlerRootView>
			<ConfigProviders>
				<PrivacyProviders>
					<DataProviders>
						<ProfileProviders>
							<MapProviders>
								<BottomSheetModalProvider>
								<QueryClientProvider client={queryClient}>
									<ThemeProvider>
										<StatusBar backgroundColor="transparent" style="auto" translucent />
										<Stack>
											<Stack.Screen name="(tabs)" options={{ headerShown: false}} />
											<Stack.Screen name="(modal)" options={{ presentation: 'formSheet', headerShown: false, sheetGrabberVisible: true ,  gestureEnabled: true }} />
										</Stack>
									</ThemeProvider>
								</QueryClientProvider>
								</BottomSheetModalProvider>
							</MapProviders>
						</ProfileProviders>
					</DataProviders>
				</PrivacyProviders>
			</ConfigProviders>
		</GestureHandlerRootView>
	);

	//
}
