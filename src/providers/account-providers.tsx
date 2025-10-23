/* * */

import { AccountContextProvider } from '@/contexts/Account.context';
import { FavoritesContextProvider } from '@/contexts/Favorites.context';
import { type PropsWithChildren } from 'react';

/* * */

export function AccountProviders({ children }: PropsWithChildren) {
	return (
		<AccountContextProvider>
			<FavoritesContextProvider>
				{children}
			</FavoritesContextProvider>
		</AccountContextProvider>
	);
}
