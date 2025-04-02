/* * */
import { ThemeProvider } from '@/contexts/Theme.context';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import 'react-native-reanimated';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
import '@/i18n';
import 'expo-dev-client';
import { IAccount } from '@/types/account.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

/* * */

const queryClient = new QueryClient();
const localStorage = AsyncStorage;

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

	const checkForAccount = () => {
		if (localStorage.getItem('account') !== null) return;
		const account: IAccount = {
			favorites: {
				patterns: [],
				stops: [
					{
						pattern_ids: [],
						stop_id: '',
					},
				],
			},
			first_name: '',
			last_name: '',
		};
		localStorage.setItem('account', JSON.stringify(account));
	};

	//
	// B. Fetch data

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
		else {
			checkForAccount();
		}
	}, [loaded]);

	//
	// C. Render components

	return (

		<ConfigProviders>
			<PrivacyProviders>
				<DataProviders>
					<ProfileProviders>
						<MapProviders>
							<QueryClientProvider client={queryClient}>
								<ThemeProvider>
									<Stack>
										<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
