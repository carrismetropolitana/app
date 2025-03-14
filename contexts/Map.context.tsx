import { MapView, MapViewRef } from '@maplibre/maplibre-react-native';
import React, { createContext, useRef } from 'react';

// Create a context type using a ref instead of state.
export const MapContext = createContext<{
	mapInstance: React.MutableRefObject<MapViewRef | null>
}>({
	mapInstance: { current: null },
});

export function MapProvider({ children }: { children: React.ReactNode }) {
	const mapRef = useRef<MapViewRef | null>(null);

	const onMapReady = (instance: MapViewRef) => {
		mapRef.current = instance;
	};

	return (
		<MapContext.Provider value={{ mapInstance: mapRef }}>
			<MapView ref={onMapReady} style={{ flex: 1 }}>
				{children}
			</MapView>
		</MapContext.Provider>
	);
}
