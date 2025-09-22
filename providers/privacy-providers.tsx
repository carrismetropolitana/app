/* * */

import { ConsentContextProvider } from '@/contexts/Consent.context';
import { type PropsWithChildren } from 'react';

/* * */

export function PrivacyProviders({ children }: PropsWithChildren) {
	return (
		<ConsentContextProvider>
			{children}
		</ConsentContextProvider>
	);
}
