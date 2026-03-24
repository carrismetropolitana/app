/* * */

import { Dates } from '@/core-replica';
import { getServiceUrl } from '@/settings/service-urls';
import { type Line, type Pattern, type Route, type Shape } from '@carrismetropolitana/api-types/network';
import { type OperationalDate } from '@tmlmobilidade/types';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getLineDataById: (lineId: string) => Line | undefined
		getPatternDataById: (patternId: string) => Promise<Pattern[] | undefined>
		getPatternVersionById: (patternId: string, version: string) => Promise<Pattern | undefined>
		getRouteDataById: (routeId: string) => Route | undefined
		getShapeDataById: (shapeId: string) => Promise<Shape | undefined>
		getValidPatternVersionForOperationalDate: (patternId: string, operationalDate?: OperationalDate) => Promise<Pattern | undefined>
	}
	data: {
		lines: Line[]
		patterns_cache: Record<string, Pattern[]>
		routes: Route[]
		shapes_cache: Record<string, Shape>
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LinesContext = createContext<LinesContextState | undefined>(undefined);

export const useLinesContext = () => {
	const context = useContext(LinesContext);
	if (!context) {
		throw new Error('useLinesContext must be used within a LinesContextProvider');
	}
	return context;
};

/* * */

export const LinesContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [patternsCache, setPatternsCache] = useState<Record<string, Pattern[]>>({});
	const [shapesCache, setShapesCache] = useState<Record<string, Shape>>({});

	//
	// B. Fetch data

	const { data: allLinesData, isLoading: allLinesLoading } = useSWR<Line[]>(`${getServiceUrl('api')}/lines`);
	const { data: allRoutesData, isLoading: allRoutesLoading } = useSWR<Route[]>(`${getServiceUrl('api')}/routes`);

	//
	// C. Handle actions

	const getLineDataById = useCallback((lineId: string) => {
		if (!allLinesData) return;
		return allLinesData.find(line => line.id === lineId);
	}, [allLinesData]);

	const getRouteDataById = useCallback((routeId: string) => {
		if (!allRoutesData) return;
		return allRoutesData.find(route => route.id === routeId);
	}, [allRoutesData]);

	const getPatternDataById = useCallback(async (patternId: string): Promise<Pattern[] | undefined> => {
		// Check if pattern is in cache
		if (patternsCache[patternId]) return patternsCache[patternId];
		// If not, fetch pattern data
		const response = await fetch(`${getServiceUrl('api')}/patterns/${patternId}`);
		const responseData = await response.json();
		if (!responseData) return;
		// Save pattern to cache
		setPatternsCache(prev => ({ ...prev, [patternId]: responseData }));
		// Return pattern data
		return responseData;
	}, [patternsCache]);

	const getPatternVersionById = useCallback(async (patternId: string, version: string): Promise<Pattern | undefined> => {
		// Get pattern data
		const patternData = await getPatternDataById(patternId);
		if (!patternData) return;
		// Check if version exists
		const versionData = patternData.find(p => p.version_id === version);
		if (versionData) return versionData;
		// Return pattern version data
		return versionData;
	}, [getPatternDataById]);

	const getValidPatternVersionForOperationalDate = useCallback(async (patternId: string, operationalDate?: OperationalDate): Promise<Pattern | undefined> => {
		// Skip if no operational date
		if (!operationalDate) operationalDate = Dates.now('Europe/Lisbon').operational_date;
		// Get pattern data
		const patternData = await getPatternDataById(patternId);
		if (!patternData?.length) return;
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
	}, [getPatternDataById]);

	const getShapeDataById = useCallback(async (shapeId: string): Promise<Shape | undefined> => {
		// Check if shape is in cache
		if (shapesCache[shapeId]) return shapesCache[shapeId];
		// If not, fetch shape data
		const response = await fetch(`${getServiceUrl('api')}/shapes/${shapeId}`);
		const responseData = await response.json();
		if (!responseData) return;
		// Save shape to cache
		setShapesCache(prev => ({ ...prev, [shapeId]: responseData }));
		// Return shape data
		return responseData;
	}, [shapesCache]);

	//
	// D. Define context value

	const contextValue: LinesContextState = useMemo(() => ({
		actions: {
			getLineDataById,
			getPatternDataById,
			getPatternVersionById,
			getRouteDataById,
			getShapeDataById,
			getValidPatternVersionForOperationalDate,
		},
		data: {
			lines: allLinesData ?? [],
			patterns_cache: patternsCache,
			routes: allRoutesData ?? [],
			shapes_cache: shapesCache,
		},
		flags: {
			loading: allLinesLoading || allRoutesLoading,
		},
	}), [getLineDataById, getPatternDataById, getPatternVersionById, getRouteDataById, getShapeDataById, getValidPatternVersionForOperationalDate, allLinesData, patternsCache, allRoutesData, shapesCache, allLinesLoading, allRoutesLoading]);

	//
	// E. Render components

	return (
		<LinesContext.Provider value={contextValue}>
			{children}
		</LinesContext.Provider>
	);

	//
};
