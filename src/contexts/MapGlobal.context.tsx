/* * */

import { type MapStyle } from '@/components/map-new/configs/map-styles';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

/* * */

interface MapGlobalContextState {
	data: {
		style: MapStyle
	}
	flags: {
		is_loading: boolean
	}
}

/* * */

const MapGlobalContext = createContext<MapGlobalContextState | undefined>(undefined);

export function useMapGlobalContext() {
	const context = useContext(MapGlobalContext);
	if (!context) {
		throw new Error('useMapGlobalContext must be used within a MapGlobalContextProvider');
	}
	return context;
}

/* * */

export const MapGlobalContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const contextValue: MapGlobalContextState = useMemo(() => ({
		data: {
			style: 'map',
		},
		flags: {
			is_loading: false,
		},
	}), []);

	//
	// E. Render components

	return (
		<MapGlobalContext.Provider value={contextValue}>
			{children}
		</MapGlobalContext.Provider>
	);

	//
};
