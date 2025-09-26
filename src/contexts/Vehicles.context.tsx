/* * */

import { type MapOverlayVehiclesGeoJsonProperties, transformVehicleDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayVehicles';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { getServiceUrl } from '@/settings/service-urls';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { type FeatureCollection, type Point } from 'geojson';
import { DateTime } from 'luxon';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface VehiclesContextState {
	actions: {
		getAllVehicles: () => undefined | Vehicle[]
		getAllVehiclesGeoJsonFC: () => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehicleById: (vehicleId: string) => undefined | Vehicle
		getVehicleByIdGeoJsonFC: (vehicleId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByLineId: (lineId: string) => Vehicle[]
		getVehiclesByLineIdGeoJsonFC: (lineId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByPatternId: (patternId: string) => Vehicle[]
		getVehiclesByPatternIdGeoJsonFC: (patternId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		getVehiclesByTripId: (tripId: string) => Vehicle[]
		getVehiclesByTripIdGeoJsonFC: (tripId: string) => FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
	}
	data: {
		vehicles: Vehicle[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const VehiclesContext = createContext<undefined | VehiclesContextState>(undefined);

export function useVehiclesContext() {
	const context = useContext(VehiclesContext);
	if (!context) {
		throw new Error('useVehiclesContext must be used within a VehiclesContextProvider');
	}
	return context;
}

/* * */

export const VehiclesContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Fetch data

	const { data: allVehiclesData, isLoading: allVehiclesLoading } = useSWR<Vehicle[], Error>(`${getServiceUrl('api')}/v2/vehicles`, { refreshInterval: 3_000 });

	//
	// B. Transform data

	const filteredVehiclesData = useMemo(() => {
		if (!allVehiclesData) return [];
		const now = DateTime.now().toUnixInteger();
		return allVehiclesData.filter((vehicle: Vehicle) => (vehicle.timestamp ?? 0) > now - 180);
	}, [allVehiclesData]);

	//
	// C. Handle actions

	const getVehicleById = (vehicleId: string): undefined | Vehicle => {
		return allVehiclesData?.find(vehicle => vehicle.id === vehicleId);
	};

	const getVehicleByIdGeoJsonFC = (vehicleId: string): FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined => {
		const vehicle = getVehicleById(vehicleId);
		if (!vehicle) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		const feature = transformVehicleDataIntoGeoJsonFeature(vehicle);
		if (feature) collection.features.push(feature);
		return collection;
	};

	const getAllVehicles = (): undefined | Vehicle[] => {
		return allVehiclesData;
	};

	const getAllVehiclesGeoJsonFC = () => {
		if (!allVehiclesData) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = allVehiclesData.map(transformVehicleDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	};

	const getVehiclesByLineId = (lineId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.line_id === lineId) || [];
	};

	const getVehiclesByLineIdGeoJsonFC = (lineId: string) => {
		const foundVehicles = getVehiclesByLineId(lineId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicleDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	};

	const getVehiclesByPatternId = (patternId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.pattern_id === patternId) || [];
	};

	const getVehiclesByPatternIdGeoJsonFC = (patternId: string) => {
		const foundVehicles = getVehiclesByPatternId(patternId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicleDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	};

	const getVehiclesByTripId = (tripId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.trip_id === tripId) || [];
	};

	const getVehiclesByTripIdGeoJsonFC = (tripId: string) => {
		const foundVehicles = getVehiclesByTripId(tripId);
		if (!foundVehicles) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties>();
		collection.features = foundVehicles.map(transformVehicleDataIntoGeoJsonFeature).filter(i => !!i);
		return collection;
	};

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
	}), [
		filteredVehiclesData,
		allVehiclesLoading,
	]);

	//
	// E. Render components

	return (
		<VehiclesContext.Provider value={contextValue}>
			{children}
		</VehiclesContext.Provider>
	);

	//
};
