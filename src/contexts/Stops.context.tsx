/* * */

import { type MapOverlayStopsGeoJsonProperties, transformStopDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayStops';
import { useLocationsContext } from '@/contexts/Locations.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { getServiceUrl } from '@/settings/service-urls';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { type FeatureCollection, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface StopsContextState {
	actions: {
		getStopById: (stopId: string) => Stop | undefined
		getStopByIdGeoJsonFC: (stopId: string) => FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		getStopLocationById: (stopId: string) => string | undefined
	}
	data: {
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
	// A. Setup variables

	const locationsContext = useLocationsContext();

	//
	// A. Fetch data

	const { data: allStopsData, isLoading: allStopsLoading } = useSWR<Stop[], Error>(`${getServiceUrl('api')}/v2/stops`);

	//
	// B. Handle actions

	const getStopById = (stopId: string): Stop | undefined => {
		if (!allStopsData) return;
		return allStopsData.find(stop => stop.id === stopId);
	};

	const getStopByIdGeoJsonFC = (stopId: string): FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined => {
		const foundStop = getStopById(stopId);
		if (!foundStop) return;
		const base = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();
		const stopFC = transformStopDataIntoGeoJsonFeature(foundStop);
		if (!stopFC) return;
		base.features.push(stopFC);
		return base;
	};

	const getStopLocationById = (stopId: string): string | undefined => {
		const foundStop = getStopById(stopId);
		if (!foundStop) return;
		const municipalityData = locationsContext.actions.getMunicipalityById(foundStop.municipality_id);
		if (!municipalityData) return;
		return municipalityData.name;
	};

	//
	// C. Define context value

	const contextValue: StopsContextState = useMemo(() => ({
		actions: {
			getStopById,
			getStopByIdGeoJsonFC,
			getStopLocationById,
		},
		data: {
			stops: allStopsData ?? [],
		},
		flags: {
			loading: allStopsLoading,
		},
	}), [
		allStopsData,
		allStopsLoading,
	]);

	//
	// D. Render components

	return (
		<StopsContext.Provider value={contextValue}>
			{children}
		</StopsContext.Provider>
	);

	//
};
