/* * */

import { MapProvider } from '@/contexts/Map.context';
import { MapOptionsContextProvider } from '@/contexts/MapOptions.context';

/* * */

export function MapProviders({ children }: { children: React.ReactNode }) {
	return (
		<MapOptionsContextProvider>
			<MapProvider>
				{children}
			</MapProvider>
		</MapOptionsContextProvider>
	);
}
