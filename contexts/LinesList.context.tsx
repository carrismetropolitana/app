/* * */

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
		updateFilterBySearch: (value: string) => void
	}
	data: {
		around: Line[]
		favorites: Line[]
		filtered: Line[]
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
	const favoritesContext = useFavoritesContext();
	const userLocationContext = useUserLocationContext();

	const [dataFavoritesState, setDataFavoritesState] = useState<Line[]>([]);
	const [dataFilteredState, setDataFilteredState] = useState<Line[]>([]);
	const [dataAroundState, setDataAroundState] = useState<Line[]>([]);

	const [filterBySearchState, setFilterBySearchState] = useState<LinesListContextState['filters']['by_search']>('');

	//
	// B. Transform data

	const applyFiltersToData = (allData: Line[] = []) => {
		//

		let filterResult = allData;

		//
		// Filter by by_search

		if (filterBySearchState) {
			// Give extra weight to favorite lines
			const boostedData = filterResult.map(line => ({ ...line, boost: favoritesContext.data.line_ids.includes(line.id) ? true : false }));
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
	}, [linesContext.data.lines, filterBySearchState]);

	useEffect(() => {
		const favoritesLinesData = linesContext.data.lines.filter(line => favoritesContext.data.line_ids.includes(line.id)) || [];
		setDataFavoritesState(favoritesLinesData);
	}, [linesContext.data.lines, favoritesContext.data.line_ids]);

	//
	// D. Handle actions

	const updateFilterBySearch = (value: LinesListContextState['filters']['by_search']) => {
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
			updateFilterBySearch,
		},
		data: {
			around: dataAroundState,
			favorites: dataFavoritesState,
			filtered: dataFilteredState,
		},
		filters: {
			by_search: filterBySearchState,
		},
		flags: {
			loading: linesContext.flags.loading,
		},
	}), [
		dataAroundState,
		dataFavoritesState,
		dataFilteredState,
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
