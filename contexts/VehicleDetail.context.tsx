/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useVehiclesContext } from '@/contexts/Vehicles.context';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { type Vehicle } from '@carrismetropolitana/api-types/vehicles';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface VehicleDetailContextState {
	data: {
		pattern: Pattern | undefined
		vehicle: undefined | Vehicle
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

	//
	// B. Transform data

	const vehicleData = useMemo(() => {
		if (!vehicleId) return;
		return vehiclesContext.actions.getVehicleById(vehicleId);
	}, [vehicleId, vehiclesContext.data.vehicles]);

	useEffect(() => {
		(async () => {
			if (!vehicleData?.pattern_id) return;
			setIsLoading(true);
			const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(vehicleData.pattern_id);
			if (validPatternData) setCurrentPatternData(validPatternData);
			setIsLoading(false);
		})();
	}, [vehicleData]);

	//
	// C. Define context value

	const contextValue: VehicleDetailContextState = useMemo(() => ({
		data: {
			pattern: currentPatternData,
			vehicle: vehicleData,
		},
		flags: {
			loading: vehiclesContext.flags.loading || isLoading,
		},
	}), [
		vehicleData,
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
