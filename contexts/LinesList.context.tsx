/* * */

import type { Line, Stop } from '@carrismetropolitana/api-types/network';

import createDocCollection from '@/hooks/useOtheSearch';
import { useLinesContext } from '@/contexts/Lines.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { getDistance } from 'geolib';
import { createContext, useContext, useEffect, useState } from 'react';

// import { useAnalyticsContext } from './Analytics.context';

import { useLocationsContext } from './Locations.context';
import { useStopsContext } from './Stops.context';

/* * */

interface LinesListContextState {
	actions: {
		getLinesAroundLocation: () => Promise<Line[]>
		updateFilterByAttribute: (value: string) => void
		updateFilterByCurrentView: (value: string) => void
		updateFilterByFacility: (value: string) => void
		updateFilterByMunicipalityOrLocality: (value: string) => void
		updateFilterBySearch: (value: string) => void
	}
	counters: {
		favorites: number
	}
	data: {
		favorites: Line[]
		filtered: Line[]
		linesAroundLocation: Line[]
		raw: Line[]
	}
	filters: {
		by_attribute: null | string
		by_current_view: 'all' | 'favorites'
		by_facility: null | string
		by_municipality_or_locality: null | string
		by_search: string
	}
	flags: {
		is_loading: boolean
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

export const LinesListContextProvider = ({ children }) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const profileContext = useProfileContext();
	const locationContext = useLocationsContext();
	const stopsContext = useStopsContext();
	// const analyticsContext = useAnalyticsContext();

	const [dataFilteredState, setDataFilteredState] = useState<Line[]>([]);
	const [dataFavoritesState, setDataFavoritesState] = useState<Line[]>([]);
	const [linesAroundLocation, setLinesAroundLocation] = useState<Line[]>([]);

	const [filterByAttributeState, setFilterByAttributeState] = useState<LinesListContextState['filters']['by_attribute']>(null);
	const [filterByCurrentViewState, setFilterByCurrentViewState] = useState<LinesListContextState['filters']['by_current_view']>('all');
	const [filterByFacilityState, setFilterByFacilityState] = useState<LinesListContextState['filters']['by_facility']>(null);
	const [filterByMunicipalityOrLocalityState, setFilterByMunicipalityOrLocalityState] = useState<LinesListContextState['filters']['by_municipality_or_locality']>(null);
	const [filterBySearchState, setFilterBySearchState] = useState<LinesListContextState['filters']['by_search']>('');

	const allLinesData = linesContext.data.lines;

	//
	// C. Transform data

	const applyFiltersToData = (allData: Line[] = []) => {
		//

		let filterResult = allData;

		//
		// Filter by_attribute

		if (filterByAttributeState) {
			filterResult = filterResult.filter(() => {
				return true;
			});
		}

		//
		// Filter by_facility

		if (filterByFacilityState) {
			filterResult = filterResult.filter(() => {
				return true;
			});
		}

		//
		// Filter by by_municipality_or_locality

		if (filterByMunicipalityOrLocalityState) {
			filterResult = filterResult.filter(() => {
				return true; // line.municipality_id === filtersState.by_municipality;
			});
		}

		//
		// Filter by by_search

		if (filterBySearchState) {
			// Give extra weight to favorite lines
			const boostedData = filterResult.map(line => ({ ...line, boost: profileContext.data.favorite_lines?.includes(line.id) ? true : false }));
			const searchHook = createDocCollection(boostedData, {
				id: 4,
				// locality_ids: 1,
				long_name: 2,
				short_name: 4,
				tts_name: 3,
			});
			filterResult = searchHook.search(filterBySearchState);
		}

		//
		// Return resulting items

		return filterResult;

		//
	};

	useEffect(() => {
		const filteredData = applyFiltersToData(linesContext.data.lines);
		setDataFilteredState(filteredData);
	}, [linesContext.data.lines, filterByAttributeState, filterByFacilityState, filterByMunicipalityOrLocalityState, filterBySearchState]);

	useEffect(() => {
		const favoritesLinesData = linesContext.data.lines?.filter(line => profileContext.data.favorite_lines?.includes(line.id)) || [];
		setDataFavoritesState(favoritesLinesData);
	}, [linesContext.data.lines, profileContext.data.favorite_lines]);

	useEffect(() => {
		if (dataFavoritesState.length > 0) {
			setFilterByCurrentViewState('favorites');
		}
	}, [dataFavoritesState.length]);

	//
	// D. Handle actions

	const updateFilterByAttribute = (value: LinesListContextState['filters']['by_attribute']) => {
		setFilterByAttributeState(value || null);
	};

	const updateFilterByCurrentView = (value: LinesListContextState['filters']['by_current_view']) => {
		setFilterByCurrentViewState(value);
	};

	const updateFilterByFacility = (value: LinesListContextState['filters']['by_facility']) => {
		setFilterByFacilityState(value || null);
	};

	const updateFilterByMunicipalityOrLocality = (value: LinesListContextState['filters']['by_municipality_or_locality']) => {
		setFilterByMunicipalityOrLocalityState(value || null);
	};

	const updateFilterBySearch = (value: LinesListContextState['filters']['by_search']) => {
		setFilterBySearchState(value);
		// analyticsContext.actions.captureWithDelay(ampli => ampli.searchLine({ search_value: value }));
	};

	const filterStopsByRadius = (stops: Stop[], center: { latitude: number, longitude: number }, radiusMeters: number) =>
		stops.filter(stop =>
			getDistance(
				{ latitude: center.latitude, longitude: center.longitude },
				{ latitude: stop.lat, longitude: stop.lon },
			) <= radiusMeters,
		);

	const getLinesAroundLocation = async (): Promise<Line[]> => {
		const center = locationContext.data.currentCords;
		const nearbyStops = filterStopsByRadius(stopsContext.data.stops, center, 500);
		const uniqueIds = Array.from(new Set(nearbyStops.flatMap(stop => stop.line_ids)));
		const nearbyLines = uniqueIds
			.map(id => allLinesData.find(line => line.id === id))
			.filter((l): l is Line => Boolean(l));
		setLinesAroundLocation(nearbyLines);
		return nearbyLines;
	};

	useEffect(() => {
		if (stopsContext.data.stops.length > 0 && allLinesData.length > 0 && locationContext.data.currentCords.latitude !== 0 && locationContext.data.currentCords.longitude !== 0) {
			getLinesAroundLocation();
		}
	}, [stopsContext.data.stops, allLinesData, locationContext.data.currentCords]);

	//
	// E. Define context value

	const contextValue: LinesListContextState = {
		actions: {
			getLinesAroundLocation,
			updateFilterByAttribute,
			updateFilterByCurrentView,
			updateFilterByFacility,
			updateFilterByMunicipalityOrLocality,
			updateFilterBySearch,

		},
		counters: {
			favorites: profileContext.counters.favorite_lines,
		},
		data: {
			favorites: dataFavoritesState,
			filtered: dataFilteredState,
			linesAroundLocation: linesAroundLocation,
			raw: linesContext.data.lines || [],
		},
		filters: {
			by_attribute: filterByAttributeState,
			by_current_view: filterByCurrentViewState,
			by_facility: filterByFacilityState,
			by_municipality_or_locality: filterByMunicipalityOrLocalityState,
			by_search: filterBySearchState,
		},
		flags: {
			is_loading: linesContext.flags.is_loading,
		},
	};

	//
	// F. Render components

	return (
		<LinesListContext.Provider value={contextValue}>
			{children}
		</LinesListContext.Provider>
	);

	//
};
