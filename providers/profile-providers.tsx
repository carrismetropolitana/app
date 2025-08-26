/* * */

import { ProfileContextProvider } from '@/contexts/Profile.context';
import WidgetContextProvider from '@/contexts/Widget.context';

/* * */

export function ProfileProviders({ children }: { children: React.ReactNode }) {
	return (
		<ProfileContextProvider>
			<WidgetContextProvider>
				{children}
			</WidgetContextProvider>
		</ProfileContextProvider>

	);
}
