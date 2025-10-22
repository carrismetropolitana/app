/* * */

import { ThemeProvider } from '@/contexts/Theme.context';
import { AccountProviders } from '@/providers/account-providers';
import { DataProviders } from '@/providers/data-providers';
import { MapProviders } from '@/providers/map-providers';
import { NativeProviders } from '@/providers/native-providers';
import { PrivacyProviders } from '@/providers/privacy-providers';
import { type PropsWithChildren } from 'react';

/* * */

export function AllProviders({ children }: PropsWithChildren) {
	return (
		<NativeProviders>
			<PrivacyProviders>
				<DataProviders>
					<AccountProviders>
						<MapProviders>
							<ThemeProvider>
								{children}
							</ThemeProvider>
						</MapProviders>
					</AccountProviders>
				</DataProviders>
			</PrivacyProviders>
		</NativeProviders>
	);
}
