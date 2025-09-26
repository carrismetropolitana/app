/* * */

import { type MapOverlayPathShapeGeoJsonProperties, MapOverlayPathWaypointGeoJsonProperties, transformShapeDataIntoGeoJsonFeature, transformWaypointDataIntoGeoJsonFeature } from '@/components/map-new/overlays/MapOverlayPath';
import { type MapOverlayVehiclesGeoJsonProperties } from '@/components/map-new/overlays/MapOverlayVehicles';
import { useLinesContext } from '@/contexts/Lines.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { getBaseGeoJsonFeatureCollection } from '@/core-replica';
import { type Pattern, type Shape } from '@carrismetropolitana/api-types/network';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { type FeatureCollection, type LineString, type Point } from 'geojson';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { useStopsContext } from './Stops.context';

/* * */

interface VehicleDetailContextState {
	data: {
		pattern: Pattern | undefined
		shape_fc: FeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties> | undefined
		vehicle: undefined | Vehicle
		vehicle_fc: FeatureCollection<Point, MapOverlayVehiclesGeoJsonProperties> | undefined
		waypoints_fc: FeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties> | undefined
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
	const stopsContext = useStopsContext();
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
		const collection = getBaseGeoJsonFeatureCollection<LineString, MapOverlayPathShapeGeoJsonProperties>();
		const feature = transformShapeDataIntoGeoJsonFeature(currentShapeData, currentPatternData?.color, currentPatternData?.text_color);
		if (feature) collection.features.push(feature);
		return collection;
	}, [currentShapeData]);

	const waypointsDataFC = useMemo(() => {
		if (!currentPatternData?.path) return;
		const collection = getBaseGeoJsonFeatureCollection<Point, MapOverlayPathWaypointGeoJsonProperties>();
		collection.features = currentPatternData.path
			.map((item) => {
				const stopData = stopsContext.actions.getStopById(item.stop_id);
				return transformWaypointDataIntoGeoJsonFeature(item, stopData, currentPatternData?.color, currentPatternData?.text_color);
			})
			.filter(i => !!i);
		return collection;
	}, [currentShapeData]);

	//
	// C. Define context value

	const contextValue: VehicleDetailContextState = useMemo(() => ({
		data: {
			pattern: currentPatternData,
			shape_fc: shapeDataFC,
			vehicle: vehicleData,
			vehicle_fc: vehicleDataFC,
			waypoints_fc: waypointsDataFC,
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
