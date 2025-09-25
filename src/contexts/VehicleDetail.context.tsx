/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type Pattern, Shape } from '@carrismetropolitana/api-types/network';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { type FeatureCollection, GeoJsonProperties, LineString, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface VehicleDetailContextState {
	data: {
		path_fc: FeatureCollection<Point> | undefined
		pattern: Pattern | undefined
		shape_fc: FeatureCollection<LineString> | undefined
		vehicle: undefined | Vehicle
		vehicle_fc: FeatureCollection<Point> | undefined
	}
	flags: {
		loading: boolean
	}
}

/* * */

const VehicleDetailContext = createContext<undefined | VehicleDetailContextState>(undefined);

export function useVehicleDetailContext() {
	const context = useContext(VehicleDetailContext);
	if (!context) {
		throw new Error('useVehicleDetailContext must be used within a VehicleDetailContextProvider');
	}
	return context;
}

/* * */

export const VehicleDetailContextProvider = ({ children, vehicleId }: PropsWithChildren<{ vehicleId: string }>) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const vehiclesContext = useVehiclesContext();

	const [isLoading, setIsLoading] = useState(true);

	const [currentPatternData, setCurrentPatternData] = useState<Pattern | undefined>(undefined);
	const [currentShapeData, setCurrentShapeData] = useState<Shape | undefined>(undefined);

	//
	// B. Transform data

	const vehicleData = useMemo(() => {
		if (!vehicleId) return;
		return vehiclesContext.actions.getVehicleById(vehicleId);
	}, [vehicleId, vehiclesContext.data.vehicles]);

	const vehicleDataFC = useMemo(() => {
		if (!vehicleId) return;
		return vehiclesContext.actions.getVehicleByIdGeoJsonFC(vehicleId);
	}, [vehicleId, vehiclesContext.data.vehicles]);

	useEffect(() => {
		(async () => {
			try {
				// Skip if no vehicle data or pattern id
				if (!vehicleData?.pattern_id) return;
				// Get current pattern version for today
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(vehicleData.pattern_id);
				if (!validPatternData) return;
				setCurrentPatternData(validPatternData);
				// Skip if no shape id
				if (!validPatternData.shape_id) return;
				// Fetch shape data
				const shapeData = await linesContext.actions.getShapeDataById(validPatternData.shape_id);
				if (!shapeData) return;
				setCurrentShapeData(shapeData);
			}
			catch (err) {
				console.error(err);
			}
			finally {
				setIsLoading(false);
			}
		})();
	}, [vehicleData]);

	const shapeDataFC = useMemo(() => {
		if (!currentShapeData?.geojson) return;
		const collection = getBaseGeoJsonFeatureCollection<LineString, GeoJsonProperties>();
		collection.features.push({ ...currentShapeData.geojson, properties: { color: currentPatternData?.color } });
		return collection;
	}, [currentShapeData]);

	//
	// C. Define context value

	const contextValue: VehicleDetailContextState = useMemo(() => ({
		data: {
			path_fc: undefined,
			pattern: currentPatternData,
			shape_fc: shapeDataFC,
			vehicle: vehicleData,
			vehicle_fc: vehicleDataFC,
		},
		flags: {
			loading: vehiclesContext.flags.loading || isLoading,
		},
	}), [
		vehicleData,
		vehicleDataFC,
		isLoading,
		shapeDataFC,
		currentPatternData,
		vehiclesContext.flags.loading,
	]);

	//
	// D. Render components

	return (
		<VehicleDetailContext.Provider value={contextValue}>
			{children}
		</VehicleDetailContext.Provider>
	);

	//
};
