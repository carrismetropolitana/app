/* * */

import 'react-native-reanimated';
import '@/i18n';
import 'expo-dev-client';

/* * */

import { ThemeProvider } from '@/contexts/Theme.context';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NativeProviders } from '@/providers/native-providers';
import { Stack } from 'expo-router';

/* * */

export default function RootLayout() {
	return (
		<NativeProviders>
			<ConfigProviders>
				<PrivacyProviders>
					<DataProviders>
						<ProfileProviders>
							<MapProviders>
								{/* <BottomSheetModalProvider> */}
								<ThemeProvider>
									<Stack>
										<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
									</Stack>
								</ThemeProvider>
								{/* </BottomSheetModalProvider> */}
							</MapProviders>
						</ProfileProviders>
					</DataProviders>
				</PrivacyProviders>
			</ConfigProviders>
		</NativeProviders>
	);
}
