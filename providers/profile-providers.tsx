/* * */

import { ProfileContextProvider } from '@/contexts/Profile.context';

/* * */

export function ProfileProviders({ children }: { children: React.ReactNode }) {
	return (
		<ProfileContextProvider>
			{children}
		</ProfileContextProvider>

	);
}
