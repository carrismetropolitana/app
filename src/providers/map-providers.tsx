/* * */

import { MapGlobalContextProvider } from '@/contexts/MapGlobal.context';
import { MapOptionsContextProvider } from '@/contexts/MapOptions.context';
import { type PropsWithChildren } from 'react';

/* * */

export function MapProviders({ children }: PropsWithChildren) {
	return (
		<MapGlobalContextProvider>
			<MapOptionsContextProvider>
				{children}
			</MapOptionsContextProvider>
		</MapGlobalContextProvider>
	);
}
