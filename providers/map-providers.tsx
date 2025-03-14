/* * */

import { MapProvider } from '@/contexts/Map.context';
import { MapOptionsContextProvider } from '@/contexts/MapOptions.context';

/* * */

export function MapProviders({ children }) {
	return (
		<MapOptionsContextProvider>
			<MapProvider>
				{children}
			</MapProvider>
		</MapOptionsContextProvider>
	);
}
