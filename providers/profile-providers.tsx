/* * */

import { AccountContextProvider } from '@/contexts/Account.context';
import { AnalyticsContextProvider } from '@/contexts/Analytics.context';
import { ProfileContextProvider } from '@/contexts/Profile.context';
import { WidgetContextProvider } from '@/contexts/Widget.context';

/* * */

export function ProfileProviders({ children }: { children: React.ReactNode }) {
	return (
		<AccountContextProvider>
			<ProfileContextProvider>
				<WidgetContextProvider>
					<AnalyticsContextProvider>
						{children}
					</AnalyticsContextProvider>
				</WidgetContextProvider>
			</ProfileContextProvider>
		</AccountContextProvider>
	);
}
