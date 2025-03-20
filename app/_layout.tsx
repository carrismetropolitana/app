/* * */

import { useColorScheme } from '@/hooks/useColorScheme';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
import 'react-native-reanimated';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import '@/i18n';
import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

const queryClient = new QueryClient();

/* * */

SplashScreen.preventAutoHideAsync();

/* * */
export default function RootLayout() {
	//

	//
	// A. Setup variables

	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		// eslint-disable-next-line
		Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'), 
		// eslint-disable-next-line
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),  
	});

	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B. Fetch data

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	//
	// C. Render components
	return (
		<ConfigProviders>
			<PrivacyProviders>
				<DataProviders>
					<ProfileProviders>
						<MapProviders>
							<QueryClientProvider client={queryClient}>
								<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
									<Stack>
										<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
										<Stack.Screen
											name="profile"
											options={{
												headerShown: false,
												presentation: 'formSheet',
												sheetGrabberVisible: true,
											}}
										/>
										<Stack.Screen
											name="line/[line_id]"
											options={{
												headerBackTitle: `${t('BackButton')}`,
												headerTitle: '',
											}}
										/>
										<Stack.Screen
											name="stop/[stop_id]"
											options={{
												headerBackTitle: `${t('BackButton')}`,
												headerTitle: '',
											}}
										/>
										<Stack.Screen name="+not-found" />
									</Stack>
									<StatusBar style="auto" />
								</ThemeProvider>
							</QueryClientProvider>
						</MapProviders>
					</ProfileProviders>
				</DataProviders>
			</PrivacyProviders>
		</ConfigProviders>
	);

	//
}
