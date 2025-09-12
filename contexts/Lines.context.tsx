/* * */

import { type Line, type Route } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getLineDataById: (lineId: string) => Line | undefined
		getRouteDataById: (routeId: string) => Route | undefined
	}
	data: {
		lines: Line[]
		routes: Route[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LinesContext = createContext<LinesContextState | undefined>(undefined);
export function useLinesContext() {
	const context = useContext(LinesContext);
	if (!context) {
		throw new Error('useLinesContext must be used within a LinesContextProvider');
	}
	return context;
}

/* * */

export const LinesContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Fetch data

	const { data: allLinesData, isLoading: allLinesLoading } = useSWR<Line[]>('https://api.carrismetropolitana.pt/v2/lines');
	const { data: allRoutesData, isLoading: allRoutesLoading } = useSWR<Route[]>('https://api.carrismetropolitana.pt/v2/routes');

	//
	// B. Handle actions

	const getLineDataById = (lineId: string) => {
		if (!allLinesData) return;
		return allLinesData.find(line => line.id === lineId);
	};

	const getRouteDataById = (routeId: string) => {
		if (!allRoutesData) return;
		return allRoutesData.find(route => route.id === routeId);
	};

	//
	// C. Define context value

	const contextValue: LinesContextState = useMemo(() => ({
		actions: {
			getLineDataById,
			getRouteDataById,
		},
		data: {
			lines: allLinesData ?? [],
			routes: allRoutesData ?? [],
		},
		flags: {
			loading: allLinesLoading || allRoutesLoading,
		},
	}), [
		allLinesData,
		allRoutesData,
		allLinesLoading,
		allRoutesLoading,
	]);

	//
	// D. Render components

	return (
		<LinesContext.Provider value={contextValue}>
			{children}
		</LinesContext.Provider>
	);

	//
};
