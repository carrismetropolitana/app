/* * */

import { ConsentContextProvider } from '@/contexts/Consent.context';
import { NotificationsContextProvider } from '@/contexts/Notifications.context';
import { UserLocationContextProvider } from '@/contexts/UserLocation.context';
import { type PropsWithChildren } from 'react';

/* * */

export function PrivacyProviders({ children }: PropsWithChildren) {
	return (
		<ConsentContextProvider>
			<NotificationsContextProvider>
				<UserLocationContextProvider>
					{children}
				</UserLocationContextProvider>
			</NotificationsContextProvider>
		</ConsentContextProvider>
	);
}
