/* * */

import { ThemeProvider } from '@/contexts/Theme.context';
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
					<MapProviders>
						<ThemeProvider>
							{children}
						</ThemeProvider>
					</MapProviders>
				</DataProviders>
			</PrivacyProviders>
		</NativeProviders>
	);
}
