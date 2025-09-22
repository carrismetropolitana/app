/* * */

import { getServiceUrl } from '@/settings/service-urls';
import { getBaseGeoJsonFeatureCollection } from '@/utils/map.utils';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { DateTime } from 'luxon';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface VehiclesContextState {
	actions: {
		getAllVehicles: () => undefined | Vehicle[]
		getAllVehiclesGeoJsonFC: () => GeoJSON.FeatureCollection | undefined
		getVehicleById: (vehicleId: string) => undefined | Vehicle
		getVehicleByIdGeoJsonFC: (vehicleId: string) => GeoJSON.FeatureCollection | undefined
		getVehiclesByLineId: (lineId: string) => Vehicle[]
		getVehiclesByLineIdGeoJsonFC: (lineId: string) => GeoJSON.FeatureCollection | undefined
		getVehiclesByPatternId: (patternId: string) => Vehicle[]
		getVehiclesByPatternIdGeoJsonFC: (patternId: string) => GeoJSON.FeatureCollection | undefined
		getVehiclesByTripId: (tripId: string) => Vehicle[]
		getVehiclesByTripIdGeoJsonFC: (tripId: string) => GeoJSON.FeatureCollection | undefined
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

	const getVehicleByIdGeoJsonFC = (vehicleId: string): GeoJSON.FeatureCollection | undefined => {
		const vehicle = getVehicleById(vehicleId);
		if (!vehicle) return;
		const collection = getBaseGeoJsonFeatureCollection();
		collection.features.push(transformVehicleDataIntoGeoJsonFeature(vehicle));
		return collection;
	};

	const getAllVehicles = (): undefined | Vehicle[] => {
		return allVehiclesData;
	};

	const getAllVehiclesGeoJsonFC = (): GeoJSON.FeatureCollection | undefined => {
		const collection = getBaseGeoJsonFeatureCollection();
		filteredVehiclesData.forEach(vehicle => collection.features.push(transformVehicleDataIntoGeoJsonFeature(vehicle)));
		return collection;
	};

	const getVehiclesByLineId = (lineId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.line_id === lineId) || [];
	};

	const getVehiclesByLineIdGeoJsonFC = (lineId: string): GeoJSON.FeatureCollection | undefined => {
		const vehicles = getVehiclesByLineId(lineId);
		if (!vehicles) return;
		const collection = getBaseGeoJsonFeatureCollection();
		vehicles.forEach(vehicle => collection.features.push(transformVehicleDataIntoGeoJsonFeature(vehicle)));
		return collection;
	};

	const getVehiclesByPatternId = (patternId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.pattern_id === patternId) || [];
	};

	const getVehiclesByPatternIdGeoJsonFC = (patternId: string): GeoJSON.FeatureCollection | undefined => {
		const vehicles = getVehiclesByPatternId(patternId);
		if (!vehicles) return;
		const collection = getBaseGeoJsonFeatureCollection();
		vehicles.forEach(vehicle => collection.features.push(transformVehicleDataIntoGeoJsonFeature(vehicle)));
		return collection;
	};

	const getVehiclesByTripId = (tripId: string): Vehicle[] => {
		return filteredVehiclesData?.filter(vehicle => vehicle.trip_id === tripId) || [];
	};

	const getVehiclesByTripIdGeoJsonFC = (tripId: string): GeoJSON.FeatureCollection | undefined => {
		const vehicles = getVehiclesByTripId(tripId);
		if (!vehicles) return;
		const collection = getBaseGeoJsonFeatureCollection();
		vehicles.forEach(vehicle => collection.features.push(transformVehicleDataIntoGeoJsonFeature(vehicle)));
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

/* * */

export function transformVehicleDataIntoGeoJsonFeature(vehicleData: Vehicle): GeoJSON.Feature<GeoJSON.Point> {
	return {
		geometry: {
			coordinates: [vehicleData.lon || 0, vehicleData.lat || 0],
			type: 'Point',
		},
		properties: {
			bearing: vehicleData.bearing,
			block_id: vehicleData.block_id,
			current_status: vehicleData.current_status,
			delay: Math.floor(Date.now() / 1000) - (vehicleData.timestamp || 0),
			id: vehicleData.id,
			line_id: vehicleData.line_id,
			pattern_id: vehicleData.id,
			route_id: vehicleData.route_id,
			schedule_relationship: vehicleData.schedule_relationship,
			shift_id: vehicleData.shift_id,
			speed: vehicleData.speed,
			stop_id: vehicleData.stop_id,
			timestamp: vehicleData.timestamp,
			timeString: new Date((vehicleData.timestamp || 0) * 1000).toLocaleString(),
			trip_id: vehicleData.trip_id,
		},
		type: 'Feature',
	};
}
