/* * */

import { AccountContextProvider } from '@/contexts/Account.context';
import { FavoritesContextProvider } from '@/contexts/Favorites.context';
import { ProfileContextProvider } from '@/contexts/Profile.context';
import { type PropsWithChildren } from 'react';

/* * */

export function AccountProviders({ children }: PropsWithChildren) {
	return (
		<AccountContextProvider>
			<FavoritesContextProvider>
				<ProfileContextProvider>
					{children}
				</ProfileContextProvider>
			</FavoritesContextProvider>
		</AccountContextProvider>
	);
}
