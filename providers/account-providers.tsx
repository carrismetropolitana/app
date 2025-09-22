/* * */

import { AccountContextProvider } from '@/contexts/Account.context';
import { AnalyticsContextProvider } from '@/contexts/Analytics.context';
import { ProfileContextProvider } from '@/contexts/Profile.context';
import { PropsWithChildren } from 'react';

/* * */

export function AccountProviders({ children }: PropsWithChildren) {
	return (
		<AccountContextProvider>
			<ProfileContextProvider>
				<AnalyticsContextProvider>
					{children}
				</AnalyticsContextProvider>
			</ProfileContextProvider>
		</AccountContextProvider>
	);
}
