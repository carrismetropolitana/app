/* * */

import { MapGlobalContextProvider } from '@/contexts/MapGlobal.context';
import { type PropsWithChildren } from 'react';

/* * */

export function MapProviders({ children }: PropsWithChildren) {
	return (
		<MapGlobalContextProvider>
			{children}
		</MapGlobalContextProvider>
	);
}
