/* * */

import { type Stop } from '@carrismetropolitana/api-types/network';
import { getBaseGeoJsonFeatureCollection } from '@tmlmobilidade/utils';
import { Feature, type FeatureCollection, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface StopsContextState {
	actions: {
		getStopById: (stopId: string) => Stop | undefined
		getStopByIdGeoJsonFC: (stopId: string) => FeatureCollection<Point, Stop> | undefined
	}
	data: {
		geojson: FeatureCollection<Point, Stop>
		stops: Stop[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const StopsContext = createContext<StopsContextState | undefined>(undefined);

export function useStopsContext() {
	const context = useContext(StopsContext);
	if (!context) {
		throw new Error('useStopsContext must be used within a StopsContextProvider');
	}
	return context;
}

/* * */

export const StopsContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Fetch data

	const { data: allStopsData, isLoading: allStopsLoading } = useSWR<Stop[], Error>('https://api.carrismetropolitana.pt/v2/stops');

	//
	// B. Transform data

	const allStopsGeoJson = useMemo(() => {
		const base = getBaseGeoJsonFeatureCollection<Point, Stop>();
		if (!allStopsData) return base;
		base.features = allStopsData.map(stop => transformStopDataIntoGeoJsonFeature(stop));
		return base;
	}, [allStopsData]);

	//
	// C. Handle actions

	const getStopById = (stopId: string): Stop | undefined => {
		if (!allStopsData) return;
		return allStopsData.find(stop => stop.id === stopId);
	};

	const getStopByIdGeoJsonFC = (stopId: string): FeatureCollection<Point, Stop> | undefined => {
		const foundStop = getStopById(stopId);
		if (!foundStop) return;
		const base = getBaseGeoJsonFeatureCollection<Point, Stop>();
		const stopFC = transformStopDataIntoGeoJsonFeature(foundStop);
		base.features.push(stopFC);
		return base;
	};

	//
	// D. Define context value

	const contextValue: StopsContextState = useMemo(() => ({
		actions: {
			getStopById,
			getStopByIdGeoJsonFC,
		},
		data: {
			geojson: allStopsGeoJson,
			stops: allStopsData ?? [],
		},
		flags: {
			loading: allStopsLoading,
		},
	}), [
		allStopsGeoJson,
		allStopsData,
		allStopsLoading,
	]);

	//
	// E. Render components

	return (
		<StopsContext.Provider value={contextValue}>
			{children}
		</StopsContext.Provider>
	);

	//
};

/* * */

export function transformStopDataIntoGeoJsonFeature(stopData: Stop): Feature<Point, Stop> {
	return {
		geometry: {
			coordinates: [stopData.lon, stopData.lat],
			type: 'Point',
		},
		properties: stopData,
		type: 'Feature',
	};
}
