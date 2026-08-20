/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useUserLocationContext } from '@/contexts/UserLocation.context';
import createDocCollection from '@/hooks/useOtheSearch';
import { HubLine } from '@tmlmobilidade/go-types-public-info';
import { distance } from '@turf/turf';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

/* * */

interface LineSelectionContextState {
	actions: {
		addToRecent: (lineId: string) => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		favorites: HubLine[]
		filtered: HubLine[]
		nearby: HubLine[]
		recent: HubLine[]
	}
	filters: {
		by_search: string
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LineSelectionContext = createContext<LineSelectionContextState | undefined>(undefined);

export const useLineSelectionContext = () => {
	const context = useContext(LineSelectionContext);
	if (!context) {
		throw new Error('useLineSelectionContext must be used within a LineSelectionContextProvider');
	}
	return context;
};

/* * */

export const LineSelectionContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const userLocationContext = useUserLocationContext();

	const [filterBySearchState, setFilterBySearchState] = useState<LineSelectionContextState['filters']['by_search']>('');

	//
	// B. Transform data

	const recentLinesData: HubLine[] = useMemo(() => {
		// Get recent line IDs from user preferences
		const recentLineIds = new Set(accountContext.data.account?.preferences?.recent_line_ids || []);
		// Map IDs to line data
		return Array.from(recentLineIds)
			.map(id => linesContext.data.lines.find(line => line._id === id))
			.filter(item => !!item)
			.sort((a, b) => a._id.localeCompare(b._id));
	}, [accountContext.data.account?.preferences?.recent_line_ids, linesContext.data.lines]);

	const favoriteLinesData: HubLine[] = useMemo(() => {
		const currentFavorites = new Set(accountContext.data.account?.favorites.line_ids || []);
		return linesContext.data.lines.filter(line => currentFavorites.has(line._id));
	}, [linesContext.data.lines, accountContext.data.account?.favorites.line_ids]);

	const nearbyLinesData: HubLine[] = useMemo(() => {
		// Skip if no stops are available
		if (!stopsContext.data.stops.length) return [];
		// Get user location
		const userLocation = userLocationContext.data.location?.coords;
		if (!userLocation) return [];
		// Filter stops by radius using turf
		const stopsWithinRadius = stopsContext.data.stops.filter((stop) => {
			const meters = distance(
				{ coordinates: [userLocation.longitude, userLocation.latitude], type: 'Point' },
				{ coordinates: [stop.longitude, stop.latitude], type: 'Point' },
				{ units: 'meters' },
			);
			return meters <= 500;
		});
		// Get unique line IDs from nearby stops
		return Array
			.from(new Set(stopsWithinRadius.flatMap(stop => stop.line_ids)))
			.map(id => linesContext.data.lines.find(line => line._id === id))
			.filter((l): l is HubLine => Boolean(l))
			.slice(0, 5); // Limit to 5 items
	}, [stopsContext.data.stops, userLocationContext.data.location, linesContext.data.lines]);

	const filteredLinesData: HubLine[] = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return linesContext.data.lines;
		// Give extra weight to favorite lines
		const boostedData = linesContext.data.lines.map(line => ({ ...line, boost: accountContext.data.account?.favorites.line_ids.includes(line._id) ? true : false }));
		const searchHook = createDocCollection(boostedData, {
			_id: 4,
			// locality_ids: 1,
			long_name: 2,
			short_name: 4,
			tts_name: 3,
		});
		return searchHook.search(filterBySearchState);
	}, [filterBySearchState, linesContext.data.lines, accountContext.data.account?.favorites.line_ids]);

	//
	// D. Handle actions

	const addToRecent = useCallback((lineId: string) => {
		// Get current recent lines from user preferences
		const currentRecentLines = new Set(accountContext.data.account?.preferences?.recent_line_ids || []);
		// If the item is already in recent, remove it (to re-add it at the top)
		if (currentRecentLines.has(lineId)) currentRecentLines.delete(lineId);
		// Add the new item
		currentRecentLines.add(lineId);
		// Limit to the last 3 items
		const limitedRecentLines = Array.from(currentRecentLines).slice(-3);
		// Update user preferences
		accountContext.actions.update('preferences.recent_line_ids', limitedRecentLines);
	}, [accountContext.actions, accountContext.data.account?.preferences?.recent_line_ids]);

	const updateFilterBySearch = (value: string) => {
		setFilterBySearchState(value);
	};

	//
	// E. Define context value

	const contextValue: LineSelectionContextState = useMemo(() => ({
		actions: {
			addToRecent,
			updateFilterBySearch,
		},
		data: {
			favorites: favoriteLinesData,
			filtered: filteredLinesData,
			nearby: nearbyLinesData,
			recent: recentLinesData,
		},
		filters: {
			by_search: filterBySearchState,
		},
		flags: {
			loading: linesContext.flags.loading,
		},
	}), [addToRecent, favoriteLinesData, filteredLinesData, nearbyLinesData, recentLinesData, filterBySearchState, linesContext.flags.loading]);

	//
	// F. Render components

	return (
		<LineSelectionContext.Provider value={contextValue}>
			{children}
		</LineSelectionContext.Provider>
	);

	//
};
