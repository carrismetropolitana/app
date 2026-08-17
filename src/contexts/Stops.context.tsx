/* * */

import { type MapOverlayStopsGeoJsonProperties, transformStopDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlayStops';
import { useLocationsContext } from '@/contexts/Locations.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { getServiceUrl } from '@/settings/service-urls';
import { formatStopLocation } from '@/utils/formatStopLocation';
import { type HubStop } from '@tmlmobilidade/go-types-public-info';
import { type ApiResponse } from '@tmlmobilidade/types';
import { type FeatureCollection, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface StopsContextState {
	actions: {
		getStopById: (stopId: string) => HubStop | undefined
		getStopByIdGeoJsonFC: (stopId: string) => FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined
		getStopLocationById: (stopId: string) => string | undefined
	}
	data: {
		stops: HubStop[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const StopsContext = createContext<StopsContextState | undefined>(undefined);

export const useStopsContext = () => {
	const context = useContext(StopsContext);
	if (!context) {
		throw new Error('useStopsContext must be used within a StopsContextProvider');
	}
	return context;
};

/* * */

export const StopsContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const locationsContext = useLocationsContext();

	//
	// A. Fetch data

	const { data: allStopsResponse, isLoading: allStopsLoading } = useSWR<ApiResponse<HubStop[]>, Error>(`${getServiceUrl('go_api_url')}/hub/api/v1/network/stops`);
	const allStopsData = allStopsResponse?.data ?? [];

	//
	// B. Handle actions

	const getStopById = useCallback((stopId: string): HubStop | undefined => {
		return allStopsData.find((stop) => {
			return stop._id.toString() === stopId;
		});
	}, [allStopsData]);

	const getStopByIdGeoJsonFC = useCallback((stopId: string): FeatureCollection<Point, MapOverlayStopsGeoJsonProperties> | undefined => {
		const foundStop = getStopById(stopId);
		if (!foundStop) return;
		const base = getBaseGeoJsonFeatureCollection<Point, MapOverlayStopsGeoJsonProperties>();
		const stopFC = transformStopDataIntoGeoJsonFeature(foundStop);
		if (!stopFC) return;
		base.features.push(stopFC);
		return base;
	}, [getStopById]);

	const getStopLocationById = useCallback((stopId: string): string | undefined => {
		const foundStop = getStopById(stopId);
		if (!foundStop) return;
		// Find municipality and locality
		const foundMunicipality = locationsContext.actions.getMunicipalityById(foundStop.municipality_id);
		const foundLocality = locationsContext.actions.getLocalityById(foundStop.locality_id ?? '');
		// Format the location name
		return formatStopLocation(foundLocality?.name, foundMunicipality?.name);
	}, [getStopById, locationsContext.actions]);

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
	}), [allStopsData, allStopsLoading, getStopById, getStopByIdGeoJsonFC, getStopLocationById]);

	//
	// D. Render components

	return (
		<StopsContext.Provider value={contextValue}>
			{children}
		</StopsContext.Provider>
	);

	//
};
