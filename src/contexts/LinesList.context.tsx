/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useUserLocationContext } from '@/contexts/UserLocation.context';
import createDocCollection from '@/hooks/useOtheSearch';
import { type Line } from '@carrismetropolitana/api-types/network';
import { distance } from '@turf/turf';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

/* * */

interface LinesListContextState {
	actions: {
		addToRecent: (item: Line) => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		favorites: Line[]
		filtered: Line[]
		nearby: Line[]
		recent: Line[]
	}
	filters: {
		by_search: string
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LinesListContext = createContext<LinesListContextState | undefined>(undefined);

export function useLinesListContext() {
	const context = useContext(LinesListContext);
	if (!context) {
		throw new Error('useLinesListContext must be used within a LinesListContextProvider');
	}
	return context;
}

/* * */

export const LinesListContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const favoritesContext = useFavoritesContext();
	const userLocationContext = useUserLocationContext();

	const [filterBySearchState, setFilterBySearchState] = useState<LinesListContextState['filters']['by_search']>('');

	//
	// B. Transform data

	const recentLinesData: Line[] = useMemo(() => {
		// Get recent line IDs from user preferences
		const recentLineIds = new Set(accountContext.data.account?.preferences?.recent_line_ids || []);
		// Map IDs to line data
		return Array.from(recentLineIds)
			.map(id => linesContext.data.lines.find(line => line.id === id))
			.filter(item => !!item)
			.sort((a, b) => a.id.localeCompare(b.id));
	}, [accountContext.data.account?.preferences?.recent_line_ids, linesContext.data.lines]);

	const favoriteLinesData: Line[] = useMemo(() => {
		const currentFavorites = new Set(favoritesContext.data.line_ids || []);
		return linesContext.data.lines.filter(line => currentFavorites.has(line.id));
	}, [linesContext.data.lines, favoritesContext.data.line_ids]);

	const nearbyLinesData: Line[] = useMemo(() => {
		// Skip if no stops are available
		if (!stopsContext.data.stops.length) return [];
		// Get user location
		const userLocation = userLocationContext.data.location?.coords;
		if (!userLocation) return [];
		// Filter stops by radius using turf
		const stopsWithinRadius = stopsContext.data.stops.filter((stop) => {
			const meters = distance(
				{ coordinates: [userLocation.longitude, userLocation.latitude], type: 'Point' },
				{ coordinates: [stop.lon, stop.lat], type: 'Point' },
				{ units: 'meters' },
			);
			return meters <= 500;
		});
		// Get unique line IDs from nearby stops
		return Array
			.from(new Set(stopsWithinRadius.flatMap(stop => stop.line_ids)))
			.map(id => linesContext.data.lines.find(line => line.id === id))
			.filter((l): l is Line => Boolean(l))
			.slice(0, 5); // Limit to 5 items
	}, [stopsContext.data.stops, userLocationContext.data.location, linesContext.data.lines]);

	const filteredLinesData: Line[] = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return linesContext.data.lines;
		// Give extra weight to favorite lines
		const boostedData = linesContext.data.lines.map(line => ({ ...line, boost: accountContext.data.account?.favorites.line_ids.includes(line.id) ? true : false }));
		const searchHook = createDocCollection(boostedData, {
			id: 4,
			// locality_ids: 1,
			long_name: 2,
			short_name: 4,
			tts_name: 3,
		});
		return searchHook.search(filterBySearchState);
	}, [linesContext.data.lines, filterBySearchState]);

	//
	// D. Handle actions

	const addToRecent = (item: Line) => {
		// Get current recent lines from user preferences
		const currentRecentLines = new Set(accountContext.data.account?.preferences?.recent_line_ids || []);
		// If the item is already in recent, remove it (to re-add it at the top)
		if (currentRecentLines.has(item.id)) currentRecentLines.delete(item.id);
		// Add the new item
		currentRecentLines.add(item.id);
		// Limit to the last 3 items
		const limitedRecentLines = Array.from(currentRecentLines).slice(-3);
		// Update user preferences
		accountContext.actions.update('preferences.recent_line_ids', limitedRecentLines);
	};

	const updateFilterBySearch = (value: string) => {
		setFilterBySearchState(value);
	};

	//
	// E. Define context value

	const contextValue: LinesListContextState = useMemo(() => ({
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
	}), [
		recentLinesData,
		favoriteLinesData,
		nearbyLinesData,
		filteredLinesData,
		filterBySearchState,
		linesContext.flags.loading,
	]);

	//
	// F. Render components

	return (
		<LinesListContext.Provider value={contextValue}>
			{children}
		</LinesListContext.Provider>
	);

	//
};
