/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useStopsContext } from '@/contexts/Stops.context';
import createDocCollection from '@/hooks/useOtheSearch';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

/* * */

interface StopsListContextState {
	actions: {
		addToRecent: (item: Stop) => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		all: Stop[]
		favorites: Stop[]
		filtered: Stop[]
		recent: Stop[]
	}
	filters: {
		by_search: string
	}
	flags: {
		loading: boolean
	}
}

/* * */

const StopsListContext = createContext<StopsListContextState | undefined>(undefined);

export function useStopsListContext() {
	const context = useContext(StopsListContext);
	if (!context) {
		throw new Error('useStopsListContext must be used within a StopsListContextProvider');
	}
	return context;
}

/* * */

export const StopsListContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const favoritesContext = useFavoritesContext();

	const [filterBySearchState, setFilterBySearchState] = useState<StopsListContextState['filters']['by_search']>('');

	//
	// B. Transform data

	const recentStopsData = useMemo(() => {
		// Get recent stop IDs from user preferences
		const recentStopIds = new Set(accountContext.data.account?.preferences?.recent_stop_ids || []);
		// Map IDs to stop data
		return Array.from(recentStopIds)
			.map(id => stopsContext.data.stops.find(stop => stop.id === id))
			.filter(item => !!item)
			.sort((a, b) => a.id.localeCompare(b.id));
	}, [accountContext.data.account?.preferences?.recent_stop_ids, stopsContext.data.stops]);

	const favoriteStopsData = useMemo(() => {
		const currentFavorites = new Set(favoritesContext.data.stop_ids || []);
		return stopsContext.data.stops.filter(stop => currentFavorites.has(stop.id));
	}, [stopsContext.data.stops, favoritesContext.data.stop_ids]);

	const filteredStopsData = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return [];
		// Give extra weight to favorite stops
		const boostedData = stopsContext.data.stops.map(stop => ({ ...stop, boost: accountContext.data.account?.favorites.stop_ids.includes(stop.id) ? true : false }));
		const searchHook = createDocCollection(boostedData, {
			id: 4,
			long_name: 2,
			tts_name: 3,
		});
		return searchHook.search(filterBySearchState);
	}, [stopsContext.data.stops, filterBySearchState]);

	//
	// D. Handle actions

	const addToRecent = (item: Stop) => {
		// Get current recent stops from user preferences
		const currentRecentStops = new Set(accountContext.data.account?.preferences?.recent_stop_ids || []);
		// If the item is already in recent, remove it (to re-add it at the top)
		if (currentRecentStops.has(item.id)) currentRecentStops.delete(item.id);
		// Add the new item
		currentRecentStops.add(item.id);
		// Limit to the last 3 items
		const limitedRecentStops = Array.from(currentRecentStops).slice(-3);
		// Update user preferences
		accountContext.actions.update('preferences.recent_stop_ids', limitedRecentStops);
	};

	const updateFilterBySearch = (value: string) => {
		setFilterBySearchState(value);
	};

	//
	// E. Define context value

	const contextValue: StopsListContextState = useMemo(() => ({
		actions: {
			addToRecent,
			updateFilterBySearch,
		},
		data: {
			all: stopsContext.data.stops,
			favorites: favoriteStopsData,
			filtered: filteredStopsData,
			recent: recentStopsData,
		},
		filters: {
			by_search: filterBySearchState,
		},
		flags: {
			loading: stopsContext.flags.loading,
		},
	}), [
		recentStopsData,
		favoriteStopsData,
		filteredStopsData,
		filterBySearchState,
		stopsContext.data.stops,
		stopsContext.flags.loading,
	]);

	//
	// F. Render components

	return (
		<StopsListContext.Provider value={contextValue}>
			{children}
		</StopsListContext.Provider>
	);

	//
};
