/* * */

import { type Line, type Pattern, type Route } from '@carrismetropolitana/api-types/network';
import { type OperationalDate } from '@tmlmobilidade/types';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getLineDataById: (lineId: string) => Line | undefined
		getPatternDataById: (patternId: string) => Promise<Pattern[] | undefined>
		getPatternVersionById: (patternId: string, version: string) => Promise<Pattern | undefined>
		getRouteDataById: (routeId: string) => Route | undefined
		getValidPatternVersionForOperationalDate: (patternId: string, operationalDate: OperationalDate) => Promise<Pattern | undefined>
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

	async function getPatternDataById(patternId: string): Promise<Pattern[] | undefined> {
		// Check if pattern is in cache
		if (patternsCache[patternId]) return patternsCache[patternId];
		// If not, fetch pattern data
		const response = await fetch(`https://api.carrismetropolitana.pt/v2/patterns/${patternId}`);
		const responseData = await response.json();
		if (!responseData) return;
		// Save pattern to cache
		setPatternsCache(prev => ({ ...prev, [patternId]: responseData }));
		// Return pattern data
		return responseData;
	};

	async function getPatternVersionById(patternId: string, version: string): Promise<Pattern | undefined> {
		// Get pattern data
		const patternData = await getPatternDataById(patternId);
		if (!patternData) return;
		// Check if version exists
		const versionData = patternData.find(p => p.version_id === version);
		if (versionData) return versionData;
		// Return pattern version data
		return versionData;
	};

	async function getValidPatternVersionForOperationalDate(patternId: string, operationalDate: OperationalDate): Promise<Pattern | undefined> {
		// Skip if no operational date
		if (!operationalDate) return;
		const patternData = await getPatternDataById(patternId);
		if (!patternData) return;
		const activePatterns: Pattern[] = [];
		let closestDateSoFar: null | string = null;
		let patternGroupWithClosestDate: null | Pattern = null;
		for (const patternGroup of patternData) {
			const selectedDate = operationalDate;
			if (!selectedDate) return;
			// Find the closest valid date
			const closestDate = patternGroup.valid_on.reduce((acc, curr) => {
				if (selectedDate <= curr && (acc === '' || curr < acc)) return curr;
				return acc;
			}, '');
			if (!closestDateSoFar) closestDateSoFar = closestDate;
			if (closestDate && closestDate <= closestDateSoFar) {
				patternGroupWithClosestDate = patternGroup;
				closestDateSoFar = closestDate;
			}
		}
		// If the closest date is valid, add the pattern group to the list
		if (patternGroupWithClosestDate && !activePatterns.find(activePattern => activePattern.id === patternGroupWithClosestDate.id)) {
			return patternGroupWithClosestDate;
		}
	};

	//
	// C. Define context value

	const contextValue: LinesContextState = useMemo(() => ({
		actions: {
			getLineDataById,
			getPatternDataById,
			getPatternVersionById,
			getRouteDataById,
			getValidPatternVersionForOperationalDate,
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
