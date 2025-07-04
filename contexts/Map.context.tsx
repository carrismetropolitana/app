// import { MapView, MapViewRef } from '@maplibre/maplibre-react-native';
import { MapViewRef } from '@maplibre/maplibre-react-native';
import React, { createContext, useRef } from 'react';

export const MapContext = createContext<{
	mapInstance: React.MutableRefObject<MapViewRef | null>
}>({
	mapInstance: { current: null },
});

export function MapProvider({ children }: { children: React.ReactNode }) {
	const mapRef = useRef<MapViewRef | null>(null);

	return (
		<MapContext.Provider value={{ mapInstance: mapRef }}>
			{children}
		</MapContext.Provider>
	);
}
