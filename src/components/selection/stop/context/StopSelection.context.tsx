/* * */

import { type MapOverlayStopsGeoJsonProperties, transformStopDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlayStops';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useAccountContext } from '@/contexts/Account.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { useUserLocationContext } from '@/contexts/UserLocation.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import createDocCollection from '@/hooks/useOtheSearch';
import { type StopWithDistance } from '@/schemas/stop-with-distance';
import { type HubStop } from '@tmlmobilidade/go-types-public-info';
import { distance } from '@turf/turf';
import { type FeatureCollection, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

/* * */

interface StopSelectionContextState {
	actions: {
		addToRecent: (stopId: string) => void
		toggleViewMode: (mode?: 'list' | 'map') => void
		updateFilterBySearch: (value: string) => void
	}
	data: {
		favorites: HubStop[]
		favorites_fc: FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		filtered: HubStop[]
		filtered_fc: FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		nearby: StopWithDistance[]
		recent: HubStop[]
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

const StopSelectionContext = createContext<StopSelectionContextState | undefined>(undefined);

function getStopId(stop: HubStop): string | undefined {
	const id = stop._id ?? (stop as HubStop & { id?: number | string }).id;
	return id?.toString();
}

export function useStopSelectionContext() {
	const context = useContext(StopSelectionContext);
	if (!context) {
		throw new Error('useStopSelectionContext must be used within a StopSelectionContextProvider');
	}
	return context;
}

/* * */

export const StopSelectionContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();
	const userLocationContext = useUserLocationContext();
	const accessibilityContext = useAccessibilityContext();

	const [filterBySearchState, setFilterBySearchState] = useState<StopSelectionContextState['filters']['by_search']>('');

	const [flagViewModeState, setFlagViewModeState] = useState<StopSelectionContextState['flags']['view_mode']>(accessibilityContext.flags.screen_reader ? 'list' : 'map');

	//
	// B. Transform data

	const recentStopsData: HubStop[] = useMemo(() => {
		// Get recent stop IDs from user preferences
		const recentStopIds = new Set(accountContext.data.account?.preferences?.recent_stop_ids || []);
		// Map IDs to stop data
		return Array.from(recentStopIds)
			.map(id => stopsContext.data.stops.find(stop => getStopId(stop) === id))
			.filter(item => !!item)
			.sort((a, b) => (getStopId(a) ?? '').localeCompare(getStopId(b) ?? ''));
	}, [accountContext.data.account?.preferences?.recent_stop_ids, stopsContext.data.stops]);

	const favoriteStopsData: HubStop[] = useMemo(() => {
		const currentFavorites = new Set(accountContext.data.account?.favorites.stop_ids || []);
		return stopsContext.data.stops.filter((stop) => {
			const stopId = getStopId(stop);
			return !!stopId && currentFavorites.has(stopId);
		});
	}, [stopsContext.data.stops, accountContext.data.account?.favorites.stop_ids]);

	const favoriteStopsDataFC = useMemo(() => {
		if (!favoriteStopsData) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();
		collection.features = favoriteStopsData.map(transformStopDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	}, [favoriteStopsData]);

	const nearbyStopsData: StopWithDistance[] = useMemo(() => {
		// Skip if no stops are available
		if (!stopsContext.data.stops.length) return [];
		// Get user location
		const userLocation = userLocationContext.data.location?.coords;
		if (!userLocation) return [];
		// Filter stops by radius using turf
		const stopsWithinRadius = stopsContext.data.stops
			.map((stop) => {
				const meters = distance(
					{ coordinates: [userLocation.longitude, userLocation.latitude], type: 'Point' },
					{ coordinates: [stop.longitude, stop.latitude], type: 'Point' },
					{ units: 'meters' },
				);
				return { ...stop, distance: meters };
			})
			.filter(extendedStop => extendedStop.distance <= 500)
			.sort((a, b) => a.distance - b.distance);
		// Limit to 25 stops
		return stopsWithinRadius.slice(0, 25);
	}, [stopsContext.data.stops, userLocationContext.data.location]);

	const filteredStopsData: HubStop[] = useMemo(() => {
		// Skip if no filters are applied
		if (!filterBySearchState) return stopsContext.data.stops;
		// Give extra weight to favorite stops
		const boostedData = stopsContext.data.stops.map(stop => ({
			...stop,
			boost: accountContext.data.account?.favorites.stop_ids.includes(getStopId(stop) ?? '') ? true : false,
			id: getStopId(stop) ?? '',
		}));
		const searchHook = createDocCollection(boostedData, {
			id: 4,
			name: 2,
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

	const contextValue: StopSelectionContextState = useMemo(() => ({
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
			nearby: nearbyStopsData,
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
		nearbyStopsData,
		filteredStopsDataFC,
		recentStopsData,
		stopsContext.flags.loading,
		flagViewModeState,
	]);

	//
	// F. Render components

	return (
		<StopSelectionContext.Provider value={contextValue}>
			{children}
		</StopSelectionContext.Provider>
	);

	//
};
