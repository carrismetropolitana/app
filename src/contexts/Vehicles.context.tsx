/* * */

import { type MapOverlayVehiclesGeoJsonProperties, transformVehicleDataIntoGeoJsonFeature } from '@/components/map/overlays/MapOverlayVehicles';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { useVehicleMetadata } from '@/hooks/useVehicleMetadata';
import { CARRIS_METROPOLITANA_AGENCY_IDS } from '@/settings/agencies.settings';
import { getServiceUrl } from '@/settings/service-urls';
import { type HubVehiclePosition } from '@tmlmobilidade/go-types-public-info';
import { type ApiResponse } from '@tmlmobilidade/types';
import { type FeatureCollection, type Point } from 'geojson';

import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface VehiclesContextState {
	actions: {
		getAllVehicles: () => undefined | HubVehiclePosition[]
		getAllVehiclesGeoJsonFC: () => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehicleById: (vehicleId: string) => undefined | HubVehiclePosition
		getVehicleByIdGeoJsonFC: (vehicleId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByLineId: (lineId: string) => HubVehiclePosition[]
		getVehiclesByLineIdGeoJsonFC: (lineId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByPatternId: (patternId: string) => HubVehiclePosition[]
		getVehiclesByPatternIdGeoJsonFC: (patternId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByTripId: (tripId: string) => HubVehiclePosition[]
		getVehiclesByTripIdGeoJsonFC: (tripId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
	}
	data: {
		vehicles: HubVehiclePosition[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const VehiclesContext = createContext<undefined | VehiclesContextState>(undefined);

export const useVehiclesContext = () => {
	const context = useContext(VehiclesContext);
	if (!context) {
		throw new Error('useVehiclesContext must be used within a VehiclesContextProvider');
	}
	return context;
};

/* * */

export const VehiclesContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Fetch data

	const { data: allVehiclesResponse, isLoading: allVehiclesLoading } = useSWR<ApiResponse<HubVehiclePosition[]>, Error>(`${getServiceUrl('go_api_url')}/hub/api/v1/realtime/vehicles/positions`, { refreshInterval: 3_000 });
	const vehicleMetadata = useVehicleMetadata();
	const getVehicleMetadata = vehicleMetadata.actions.getMetadataForVehicleId;

	const allVehiclesData = useMemo(() => {
		const allowedAgencyIds = new Set<string>(CARRIS_METROPOLITANA_AGENCY_IDS);
		return (allVehiclesResponse?.data ?? []).filter((vehicle) => {
			if (!allowedAgencyIds.has(String(vehicle.agency_id))) return false;
			if (Math.floor((vehicle.received_at ?? 0) / 1000) <= Math.floor(Date.now() / 1000) - 180) return false;
			if (!Number.isFinite(vehicle.latitude) || !Number.isFinite(vehicle.longitude)) return false;
			if (vehicle.latitude < 38 || vehicle.latitude > 39.5) return false;
			if (vehicle.longitude < -10 || vehicle.longitude > -8) return false;
			return true;
		});
	}, [allVehiclesResponse?.data]);

	//
	// B. Transform data

	const filteredVehiclesData = allVehiclesData;

	const transformVehicle = useCallback((vehicle: HubVehiclePosition) => {
		return transformVehicleDataIntoGeoJsonFeature(vehicle, getVehicleMetadata(vehicle.vehicle_id)?.contactless ?? false);
	}, [getVehicleMetadata]);

	//
	// C. Handle actions

	const getVehicleById = useCallback((vehicleId: string): undefined | HubVehiclePosition => {
		return allVehiclesData.find(vehicle => vehicle._id === vehicleId || vehicle.vehicle_id === vehicleId);
	}, [allVehiclesData]);

	const getVehicleByIdGeoJsonFC = useCallback((vehicleId: string): FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined => {
		const vehicle = getVehicleById(vehicleId);
		if (!vehicle) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		const feature = transformVehicle(vehicle);
		if (feature) collection.features.push(feature);
		return collection;
	}, [getVehicleById, transformVehicle]);

	const getAllVehicles = useCallback((): undefined | HubVehiclePosition[] => {
		return allVehiclesData;
	}, [allVehiclesData]);

	const getAllVehiclesGeoJsonFC = useCallback(() => {
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = allVehiclesData.map(transformVehicle).filter(i => !!i);
		return collection;
	}, [allVehiclesData, transformVehicle]);

	const getVehiclesByLineId = useCallback((lineId: string): HubVehiclePosition[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.line_id === lineId) || [];
	}, [filteredVehiclesData]);

	const getVehiclesByLineIdGeoJsonFC = useCallback((lineId: string) => {
		const foundVehicles = getVehiclesByLineId(lineId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicle).filter(i => !!i);
		return collection;
	}, [getVehiclesByLineId, transformVehicle]);

	const getVehiclesByPatternId = useCallback((patternId: string): HubVehiclePosition[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.pattern_id === patternId) || [];
	}, [filteredVehiclesData]);

	const getVehiclesByPatternIdGeoJsonFC = useCallback((patternId: string) => {
		const foundVehicles = getVehiclesByPatternId(patternId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicle).filter(i => !!i);
		return collection;
	}, [getVehiclesByPatternId, transformVehicle]);

	const getVehiclesByTripId = useCallback((tripId: string): HubVehiclePosition[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.trip_id === tripId) || [];
	}, [filteredVehiclesData]);

	const getVehiclesByTripIdGeoJsonFC = useCallback((tripId: string) => {
		const foundVehicles = getVehiclesByTripId(tripId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicle).filter(i => !!i);
		return collection;
	}, [getVehiclesByTripId, transformVehicle]);

	//
	// D. Define context value

	const contextValue: VehiclesContextState = useMemo(() => ({
		actions: {
			getAllVehicles,
			getAllVehiclesGeoJsonFC,
			getVehicleById,
			getVehicleByIdGeoJsonFC,
			getVehiclesByLineId,
			getVehiclesByLineIdGeoJsonFC,
			getVehiclesByPatternId,
			getVehiclesByPatternIdGeoJsonFC,
			getVehiclesByTripId,
			getVehiclesByTripIdGeoJsonFC,
		},
		data: {
			vehicles: filteredVehiclesData || [],
		},
		flags: {
			loading: allVehiclesLoading,
		},
	}), [getAllVehicles, getAllVehiclesGeoJsonFC, getVehicleById, getVehicleByIdGeoJsonFC, getVehiclesByLineId, getVehiclesByLineIdGeoJsonFC, getVehiclesByPatternId, getVehiclesByPatternIdGeoJsonFC, getVehiclesByTripId, getVehiclesByTripIdGeoJsonFC, filteredVehiclesData, allVehiclesLoading]);

	//
	// E. Render components

	return (
		<VehiclesContext.Provider value={contextValue}>
			{children}
		</VehiclesContext.Provider>
	);

	//
};
