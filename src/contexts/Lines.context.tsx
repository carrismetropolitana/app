/* * */


import type { HubLine, HubPattern, HubRoute, HubShape } from '@tmlmobilidade/go-types-public-info';
import { type ApiResponse, type OperationalDateInt, validateOperationalDateInt } from '@tmlmobilidade/types';

import { useFilterByAgencyIds } from '@/hooks/useFilterByAgencyIds';
import { getServiceUrl } from '@/settings/service-urls';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import  { Dates } from '@tmlmobilidade/dates';
import useSWR from 'swr';

/* * */

interface LinesContextState {
	actions: {
		getLineDataById: (lineId: string) => HubLine | undefined
		getPatternDataById: (patternId: string) => Promise<HubPattern[] | undefined>
		getPatternVersionById: (patternId: string, version: string) => Promise<HubPattern | undefined>
		getRouteDataById: (routeId: string) => HubRoute | undefined
		getShapeDataById: (shapeId: string) => Promise<HubShape | undefined>
		getValidPatternVersionForOperationalDate: (patternId: string, operationalDate?: OperationalDateInt) => Promise<HubPattern | undefined>
	}
	data: {
		lines: HubLine[]
		patterns_cache: Record<string, HubPattern[]>
		routes: HubRoute[]
		shapes_cache: Record<string, HubShape>
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

	const [patternsCache, setPatternsCache] = useState<Record<string, HubPattern[]>>({});
	const [shapesCache, setShapesCache] = useState<Record<string, HubShape>>({});

	//
	// B. Fetch data

	const { data: linesResponse, isLoading: allLinesLoading } = useSWR<ApiResponse<HubLine[]>, Error>(`${getServiceUrl('api')}/lines`, { refreshInterval: 900000 }); // 15 minutes
	const { data: routesResponse, isLoading: allRoutesLoading } = useSWR<ApiResponse<HubRoute[]>, Error>(`${getServiceUrl('api')}/routes`, { refreshInterval: 900000 }); // 15 minutes

	const linesData = useFilterByAgencyIds(linesResponse, { dataType: 'line' }).data;
	const routesData = useFilterByAgencyIds(routesResponse, { dataType: 'route' }).data;

	//
	// C. Handle actions

	const getLineDataById = useCallback((lineId: string) => {
		if (!linesData) return;
		return linesData.find(line => line._id === lineId);
	}, [linesData]);

	const getRouteDataById = useCallback((routeId: string) => {
		if (!routesData) return;
		return routesData.find(route => route._id === routeId);
	}, [routesData]);

	const getPatternDataById = useCallback(async (patternId: string): Promise<HubPattern[] | undefined> => {
		// Check if pattern is in cache
		if (patternsCache[patternId]) return patternsCache[patternId];
		// If not, fetch pattern data
		const response = await fetch(`${getServiceUrl('go_api_url')}/hub/api/v1/network/patterns/${patternId}`);
		const responseData = await response.json();
		if (!responseData) return;
		// Save pattern to cache
		setPatternsCache(prev => ({ ...prev, [patternId]: responseData }));
		// Return pattern data
		return responseData;
	}, [patternsCache]);

	const getPatternVersionById = useCallback(async (patternId: string, version: string): Promise<HubPattern | undefined> => {
		// Get pattern data
		const patternData = await getPatternDataById(patternId);
		if (!patternData) return;
		// Check if version exists
		const versionData = patternData.find(p => p.version_id === version);
		if (versionData) return versionData;
		// Return pattern version data
		return versionData;
	}, [getPatternDataById]);

	const getValidPatternVersionForOperationalDate = useCallback(async (patternId: string, operationalDate?: OperationalDateInt): Promise<HubPattern | undefined> => {
		const selectedDate = operationalDate ? validateOperationalDateInt(operationalDate) : Dates.fromUnixTimestamp(operation);
		// Get pattern data
		const patternData = await getPatternDataById(patternId);
		if (!patternData?.length) return;
		let closestDateSoFar: OperationalDateInt | null = null;
		let patternGroupWithClosestDate: null | HubPattern = null;
		for (const patternGroup of patternData) {
			// Find the closest valid date
			const closestDate = patternGroup.valid_on.reduce<OperationalDateInt | null>((acc, curr) => {
				const currentDate = Number(curr) as OperationalDateInt;
				if (selectedDate <= currentDate && (acc === null || currentDate < acc)) return currentDate;
				return acc;
			}, null);
			if (closestDate !== null && (closestDateSoFar === null || closestDate <= closestDateSoFar)) {
				patternGroupWithClosestDate = patternGroup;
				closestDateSoFar = closestDate;
			}
		}
		// If the closest date is valid, add the pattern group to the list
		return patternGroupWithClosestDate ?? undefined;
	}, [getPatternDataById]);

	const getShapeDataById = useCallback(async (shapeId: string): Promise<HubShape | undefined> => {
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
			lines: linesData ?? [],
			patterns_cache: patternsCache,
			routes: routesData ?? [],
			shapes_cache: shapesCache,
		},
		flags: {
			loading: allLinesLoading || allRoutesLoading,
		},
	}), [getLineDataById, getPatternDataById, getPatternVersionById, getRouteDataById, getShapeDataById, getValidPatternVersionForOperationalDate, linesData, patternsCache, routesData, shapesCache, allLinesLoading, allRoutesLoading]);

	//
	// E. Render components

	return (
		<LinesContext.Provider value={contextValue}>
			{children}
		</LinesContext.Provider>
	);

	//
};
