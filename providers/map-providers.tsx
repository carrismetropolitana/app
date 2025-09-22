/* * */

import { MapProvider } from '@/contexts/Map.context';
import { MapOptionsContextProvider } from '@/contexts/MapOptions.context';
import { type PropsWithChildren } from 'react';

/* * */

export function MapProviders({ children }: PropsWithChildren) {
	return (
		<MapOptionsContextProvider>
			<MapProvider>
				{children}
			</MapProvider>
		</MapOptionsContextProvider>
	);
}
