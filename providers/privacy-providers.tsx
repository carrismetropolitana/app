/* * */

import { ConsentContextProvider } from '@/contexts/Consent.context';

/* * */

export function PrivacyProviders({ children }: { children: React.ReactNode }) {
	return (
		<ConsentContextProvider>
			{children}
		</ConsentContextProvider>
	);
}
