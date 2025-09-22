/* * */

import { AccountContextProvider } from '@/contexts/Account.context';
import { AnalyticsContextProvider } from '@/contexts/Analytics.context';
import { FavoritesContextProvider } from '@/contexts/Favorites.context';
import { ProfileContextProvider } from '@/contexts/Profile.context';
import { type PropsWithChildren } from 'react';

/* * */

export function AccountProviders({ children }: PropsWithChildren) {
	return (
		<AccountContextProvider>
			<FavoritesContextProvider>
				<ProfileContextProvider>
					<AnalyticsContextProvider>
						{children}
					</AnalyticsContextProvider>
				</ProfileContextProvider>
			</FavoritesContextProvider>
		</AccountContextProvider>
	);
}
