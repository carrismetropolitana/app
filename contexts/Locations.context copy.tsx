'use client';

/* * */

import type { District, Locality, Municipality, Parish } from '@carrismetropolitana/api-types/locations';

import { Routes } from '@/utils/routes';
import { ApiResponse } from '@carrismetropolitana/api-types/common';
import { createContext, useContext, useMemo } from 'react';
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
		is_loading: boolean
	}
}

/* * */

const LocationsContext = createContext<LocationsContextState | undefined>(undefined);

export function useLocationsContext() {
	const context = useContext(LocationsContext);
	if (!context) {
		throw new Error('useLocationsContext must be used within a LocationsContextProvider');
	}
	return context;
}

/* * */

export const LocationsContextProvider = ({ children }) => {
	//

	//
	// A. Fetch data

	const { data: fetchedDistrictsData, isLoading: fetchedDistrictsLoading } = useSWR<ApiResponse<District[]>, Error>(`${Routes.API}/locations/districts`);
	const { data: fetchedMunicipalitiesData, isLoading: fetchedMunicipalitiesLoading } = useSWR<ApiResponse<Municipality[]>, Error>(`${Routes.API}/locations/municipalities`);
	const { data: fetchedParishesData, isLoading: fetchedParishesLoading } = useSWR<ApiResponse<Parish[]>, Error>(`${Routes.API}/locations/parishes`);
	const { data: fetchedLocalitiesData, isLoading: fetchedLocalitiesLoading } = useSWR<ApiResponse<Locality[]>, Error>(`${Routes.API}/locations/localities`);

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

	const getDistrictById = (districtId: string): District | undefined => {
		return allDistrictsData.find(item => item.id === districtId);
	};

	const getMunicipalityById = (municipalityId: string): Municipality | undefined => {
		return allMunicipalitiesData.find(item => item.id === municipalityId);
	};

	const getParishById = (parishId: string): Parish | undefined => {
		return allParishesData.find(item => item.id === parishId);
	};

	const getLocalityById = (localityId: string): Locality | undefined => {
		return allLocalitiesData?.find(item => item.id === localityId);
	};

	//
	// D. Define context value

	const contextValue: LocationsContextState = {
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
			is_loading: fetchedDistrictsLoading || fetchedMunicipalitiesLoading || fetchedParishesLoading || fetchedLocalitiesLoading,
		},
	};

	//
	// E. Render components

	return (
		<LocationsContext.Provider value={contextValue}>
			{children}
		</LocationsContext.Provider>
	);

	//
};
