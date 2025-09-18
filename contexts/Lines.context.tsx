/* * */

import { type Line, type Pattern, type Route } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getLineDataById: (lineId: string) => Line | undefined
		getPatternDataById: (patternId: string) => Promise<null | Pattern[]>
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
	// A. Setup variables

	const [patternsCache, setPatternsCache] = useState<Record<string, Pattern[]>>({});

	//
	// B. Fetch data

	const { data: allLinesData, isLoading: allLinesLoading } = useSWR<Line[]>('https://api.carrismetropolitana.pt/v2/lines');
	const { data: allRoutesData, isLoading: allRoutesLoading } = useSWR<Route[]>('https://api.carrismetropolitana.pt/v2/routes');

	//
	// C. Handle actions

	const getLineDataById = (lineId: string) => {
		if (!allLinesData) return;
		return allLinesData.find(line => line.id === lineId);
	};

	const getRouteDataById = (routeId: string) => {
		if (!allRoutesData) return;
		return allRoutesData.find(route => route.id === routeId);
	};

	const getPatternDataById = async (patternId: string) => {
		// Check if pattern is in cache
		if (patternsCache[patternId]) return patternsCache[patternId];
		// If not, fetch pattern data
		const response = await fetch(`https://api.carrismetropolitana.pt/v2/patterns/${patternId}`);
		const responseData = await response.json();
		// Save pattern to cache
		setPatternsCache(prev => ({ ...prev, [patternId]: responseData }));
		// Return pattern data
		return responseData;
	};

	//
	// C. Define context value

	const contextValue: LinesContextState = useMemo(() => ({
		actions: {
			getLineDataById,
			getPatternDataById,
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
