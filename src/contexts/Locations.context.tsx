/* * */

import { getServiceUrl } from '@/settings/service-urls';
import { ApiResponse } from '@carrismetropolitana/api-types/common';
import { type District, type Locality, type Municipality, type Parish } from '@carrismetropolitana/api-types/locations';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface LocationsContextState {
	actions: {
		getDistrictById: (districtId: string) => District | undefined
		getLocalityById: (localityId: string) => Locality | undefined
		getMunicipalityById: (municipalityId: string) => Municipality | undefined
		getParishById: (parishId: string) => Parish | undefined
	}
	data: {
		districts: District[]
		localitites: Locality[]
		municipalities: Municipality[]
		parishes: Parish[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LocationsContext = createContext<LocationsContextState | undefined>(undefined);

export const useLocationsContext = () => {
	const context = useContext(LocationsContext);
	if (!context) {
		throw new Error('useLocationsContext must be used within a LocationsContextProvider');
	}
	return context;
};

/* * */

export const LocationsContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Fetch data

	const { data: fetchedDistrictsData, isLoading: fetchedDistrictsLoading } = useSWR<ApiResponse<District[]>, Error>(`${getServiceUrl('go_api_url')}/locations/api/locations/districts`, { refreshInterval: 900000 }); // 15 minutes
	const { data: fetchedMunicipalitiesData, isLoading: fetchedMunicipalitiesLoading } = useSWR<ApiResponse<Municipality[]>, Error>(`${getServiceUrl('go_api_url')}/locations/api/locations/municipalities`, { refreshInterval: 900000 }); // 15 minutes
	const { data: fetchedParishesData, isLoading: fetchedParishesLoading } = useSWR<ApiResponse<Parish[]>, Error>(`${getServiceUrl('go_api_url')}/locations/api/locations/parishes`, { refreshInterval: 900000 }); // 15 minutes
	const { data: fetchedLocalitiesData, isLoading: fetchedLocalitiesLoading } = useSWR<ApiResponse<Locality[]>, Error>(`${getServiceUrl('go_api_url')}/locations/api/locations/localities`, { refreshInterval: 900000 }); // 15 minutes
	
	//
	// B. Transform data

	const allDistrictsData = useMemo(() => {
		if (fetchedDistrictsData?.status !== 'success') return [];
		return fetchedDistrictsData.data;
	}, [fetchedDistrictsData]);

	const allMunicipalitiesData = useMemo(() => {
		if (fetchedMunicipalitiesData?.status !== 'success') return [];
		return fetchedMunicipalitiesData.data;
	}, [fetchedMunicipalitiesData]);

	const allParishesData = useMemo(() => {
		if (fetchedParishesData?.status !== 'success') return [];
		return fetchedParishesData.data;
	}, [fetchedParishesData]);

	const allLocalitiesData = useMemo(() => {
		if (fetchedLocalitiesData?.status !== 'success') return [];
		return fetchedLocalitiesData.data;
	}, [fetchedLocalitiesData]);

	//
	// C. Handle actions

	const getDistrictById = useCallback((districtId: string): District | undefined => {
		return allDistrictsData.find(item => item.id === districtId);
	}, [allDistrictsData]);

	const getMunicipalityById = useCallback((municipalityId: string): Municipality | undefined => {
		return allMunicipalitiesData.find(item => item.id === municipalityId);
	}, [allMunicipalitiesData]);

	const getParishById = useCallback((parishId: string): Parish | undefined => {
		return allParishesData.find(item => item.id === parishId);
	}, [allParishesData]);

	const getLocalityById = useCallback((localityId: string): Locality | undefined => {
		return allLocalitiesData?.find(item => item.id === localityId);
	}, [allLocalitiesData]);

	//
	// D. Define context value

	const contextValue: LocationsContextState = useMemo(() => ({
		actions: {
			getDistrictById,
			getLocalityById,
			getMunicipalityById,
			getParishById,
		},
		data: {
			districts: allDistrictsData || [],
			localitites: allLocalitiesData || [],
			municipalities: allMunicipalitiesData || [],
			parishes: allParishesData || [],
		},
		flags: {
			loading: fetchedDistrictsLoading || fetchedMunicipalitiesLoading || fetchedParishesLoading || fetchedLocalitiesLoading,
		},
	}), [getDistrictById, getLocalityById, getMunicipalityById, getParishById, allDistrictsData, allLocalitiesData, allMunicipalitiesData, allParishesData, fetchedDistrictsLoading, fetchedMunicipalitiesLoading, fetchedParishesLoading, fetchedLocalitiesLoading]);

	//
	// E. Render components

	return (
		<LocationsContext.Provider value={contextValue}>
			{children}
		</LocationsContext.Provider>
	);

	//
};
