/* * */

import { MapProvider } from '@/contexts/Map.context';
import { MapGlobalContextProvider } from '@/contexts/MapGlobal.context';
import { MapOptionsContextProvider } from '@/contexts/MapOptions.context';
import { type PropsWithChildren } from 'react';

/* * */

export function MapProviders({ children }: PropsWithChildren) {
	return (
		<MapGlobalContextProvider>
			<MapOptionsContextProvider>
				<MapProvider>
					{children}
				</MapProvider>
			</MapOptionsContextProvider>
		</MapGlobalContextProvider>
	);
}
