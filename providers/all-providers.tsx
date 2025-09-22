/* * */

import { ThemeProvider } from '@/contexts/Theme.context';
import { ConfigProviders } from '@/providers/config-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { NativeProviders } from '@/providers/native-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { ProfileProviders } from '@/providers/profile-providers';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PropsWithChildren } from 'react';

/* * */

export function AllProviders({ children }: PropsWithChildren) {
	return (
		<NativeProviders>
			<ConfigProviders>
				<PrivacyProviders>
					<DataProviders>
						<ProfileProviders>
							<MapProviders>
								{/* <BottomSheetModalProvider> */}
								<ThemeProvider>
									{children}
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
