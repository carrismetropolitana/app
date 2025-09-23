/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useUserLocationContext } from '@/contexts/UserLocation.context';
import createDocCollection from '@/hooks/useOtheSearch';
import { type Line, type Stop } from '@carrismetropolitana/api-types/network';
import { getDistance } from 'geolib';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface LinesListContextState {
	actions: {
		addToRecent: (item: Line) => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		all: Line[]
		around: Line[]
		favorites: Line[]
		filtered: Line[]
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

	const [dataAroundState, setDataAroundState] = useState<Line[]>([]);

	const [filterBySearchState, setFilterBySearchState] = useState<LinesListContextState['filters']['by_search']>('');

	//
	// B. Transform data

	const recentLinesData = useMemo(() => {
		// Get recent line IDs from user preferences
		const recentLineIds = new Set(accountContext.data.account?.preferences?.recent_line_ids || []);
		// Map IDs to line data
		return Array.from(recentLineIds)
			.map(id => linesContext.data.lines.find(line => line.id === id))
			.filter(item => !!item)
			.sort((a, b) => a.id.localeCompare(b.id));
	}, [accountContext.data.account?.preferences?.recent_line_ids, linesContext.data.lines]);

	const favoriteLinesData = useMemo(() => {
		const currentFavorites = new Set(favoritesContext.data.line_ids || []);
		return linesContext.data.lines.filter(line => currentFavorites.has(line.id));
	}, [linesContext.data.lines, favoritesContext.data.line_ids]);

	const filteredLinesData = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return [];
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

	const filterStopsByRadius = (stops: Stop[], center: { latitude: number, longitude: number }, radiusMeters: number) =>
		stops.filter(stop =>
			getDistance(
				{ latitude: center.latitude, longitude: center.longitude },
				{ latitude: stop.lat, longitude: stop.lon },
			) <= radiusMeters,
		);

	const getLinesAroundLocation = async (): Promise<Line[]> => {
		const center = userLocationContext.data.location?.coords;
		if (!center) return [];
		const nearbyStops = filterStopsByRadius(stopsContext.data.stops, center, 500);
		const uniqueIds = Array.from(new Set(nearbyStops.flatMap(stop => stop.line_ids)));
		const nearbyLines = uniqueIds
			.map(id => linesContext.data.lines.find(line => line.id === id))
			.filter((l): l is Line => Boolean(l));
		setDataAroundState(nearbyLines);
		return nearbyLines;
	};

	useEffect(() => {
		if (stopsContext.data.stops.length > 0 && linesContext.data.lines.length > 0 && userLocationContext.data.location?.coords.latitude !== 0 && userLocationContext.data.location?.coords.longitude !== 0) {
			getLinesAroundLocation();
		}
	}, [stopsContext.data.stops, linesContext.data.lines, userLocationContext.data.location?.coords]);

	//
	// E. Define context value

	const contextValue: LinesListContextState = useMemo(() => ({
		actions: {
			addToRecent,
			updateFilterBySearch,
		},
		data: {
			all: linesContext.data.lines,
			around: dataAroundState,
			favorites: favoriteLinesData,
			filtered: filteredLinesData,
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
		dataAroundState,
		filteredLinesData,
		filterBySearchState,
		linesContext.data.lines,
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
