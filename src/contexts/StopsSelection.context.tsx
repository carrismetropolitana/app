/* * */

import { type MapOverlayStopsGeoJsonProperties, transformStopDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayStops';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useAccountContext } from '@/contexts/Account.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import createDocCollection from '@/hooks/useOtheSearch';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { type FeatureCollection, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

/* * */

interface StopsSelectionContextState {
	actions: {
		addToRecent: (stopId: string) => void
		toggleViewMode: (mode?: 'list' | 'map') => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		favorites: Stop[]
		favorites_fc: FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		filtered: Stop[]
		filtered_fc: FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		recent: Stop[]
	}
	filters: {
		by_search: string
	}
	flags: {
		loading: boolean
		view_mode: 'list' | 'map'
	}
}

/* * */

const StopsSelectionContext = createContext<StopsSelectionContextState | undefined>(undefined);

export function useStopsSelectionContext() {
	const context = useContext(StopsSelectionContext);
	if (!context) {
		throw new Error('useStopsSelectionContext must be used within a StopsSelectionContextProvider');
	}
	return context;
}

/* * */

export const StopsSelectionContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const favoritesContext = useFavoritesContext();
	const accessibilityContext = useAccessibilityContext();

	const [filterBySearchState, setFilterBySearchState] = useState<StopsSelectionContextState['filters']['by_search']>('');

	const [flagViewModeState, setFlagViewModeState] = useState<StopsSelectionContextState['flags']['view_mode']>(accessibilityContext.flags.screen_reader ? 'list' : 'map');

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

	const favoriteStopsDataFC = useMemo(() => {
		if (!favoriteStopsData) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();
		collection.features = favoriteStopsData.map(transformStopDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	}, [favoriteStopsData]);

	const filteredStopsData = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return stopsContext.data.stops;
		// Give extra weight to favorite stops
		const boostedData = stopsContext.data.stops.map(stop => ({ ...stop, boost: accountContext.data.account?.favorites.stop_ids.includes(stop.id) ? true : false }));
		const searchHook = createDocCollection(boostedData, {
			id: 4,
			long_name: 2,
			tts_name: 3,
		});
		return searchHook.search(filterBySearchState);
	}, [stopsContext.data.stops, filterBySearchState]);

	const filteredStopsDataFC = useMemo(() => {
		if (!filteredStopsData) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();
		collection.features = filteredStopsData.map(transformStopDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	}, [filteredStopsData]);

	//
	// D. Handle actions

	const addToRecent = (stopId: string) => {
		// Get current recent stops from user preferences
		const currentRecentStops = new Set(accountContext.data.account?.preferences?.recent_stop_ids || []);
		// If the item is already in recent, remove it (to re-add it at the top)
		if (currentRecentStops.has(stopId)) currentRecentStops.delete(stopId);
		// Add the new item
		currentRecentStops.add(stopId);
		// Limit to the last 3 items
		const limitedRecentStops = Array.from(currentRecentStops).slice(-3);
		// Update user preferences
		accountContext.actions.update('preferences.recent_stop_ids', limitedRecentStops);
	};

	const updateFilterBySearch = (value: string) => {
		setFilterBySearchState(value);
	};

	const toggleViewMode = (mode?: 'list' | 'map') => {
		if (mode) setFlagViewModeState(mode);
		else setFlagViewModeState(prev => prev === 'list' ? 'map' : 'list');
	};

	//
	// E. Define context value

	const contextValue: StopsSelectionContextState = useMemo(() => ({
		actions: {
			addToRecent,
			toggleViewMode,
			updateFilterBySearch,
		},
		data: {
			favorites: favoriteStopsData,
			favorites_fc: favoriteStopsDataFC,
			filtered: filteredStopsData,
			filtered_fc: filteredStopsDataFC,
			recent: recentStopsData,
		},
		filters: {
			by_search: filterBySearchState,
		},
		flags: {
			loading: stopsContext.flags.loading,
			view_mode: flagViewModeState,
		},
	}), [
		favoriteStopsData,
		favoriteStopsDataFC,
		filterBySearchState,
		filteredStopsData,
		filteredStopsDataFC,
		recentStopsData,
		stopsContext.flags.loading,
		flagViewModeState,
	]);

	//
	// F. Render components

	return (
		<StopsSelectionContext.Provider value={contextValue}>
			{children}
		</StopsSelectionContext.Provider>
	);

	//
};
