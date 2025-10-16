/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type Line, type Pattern, Route, type Shape, type Waypoint } from '@carrismetropolitana/api-types/network';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface LineDetailContextState {
	actions: {
		selectPatternId: (patternId: string) => void
		selectTripIds: (tripIds: string[] | undefined) => void
		selectWaypointId: (stopId: string, stopSequence: number) => void
	}
	data: {
		available_patterns: Pattern[]
		available_routes: Route[]
		selected_line: Line | undefined
		selected_line_id: string | undefined
		selected_pattern: Pattern | undefined
		selected_pattern_id: string | undefined
		selected_shape: Shape | undefined
		selected_trip_ids: string[] | undefined
		selected_waypoint: undefined | Waypoint
	}
	flags: {
		loading: boolean
	}
}

/* * */

const LineDetailContext = createContext<LineDetailContextState | undefined>(undefined);

export function useLineDetailContext() {
	const context = useContext(LineDetailContext);
	if (!context) {
		throw new Error('useLineDetailContext must be used within a LineDetailContextProvider');
	}
	return context;
}

/* * */

export const LineDetailContextProvider = ({ children, lineId }: PropsWithChildren<{ lineId: string }>) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const operationalDateContext = useOperationalDateContext();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();
	const [selectedTripIds, setSelectedTripIds] = useState<string[] | undefined>();

	const [selectedPatternData, setSelectedPatternData] = useState<Pattern | undefined>();
	const [selectedWaypointData, setSelectedWaypointData] = useState<undefined | Waypoint>();
	const [selectedShapeData, setSelectedShapeData] = useState<Shape | undefined>();

	//
	// B. Transform data

	const selectedLineData = useMemo(() => {
		if (!lineId) return;
		return linesContext.actions.getLineDataById(lineId);
	}, [lineId]);

	const availableRoutesData = useMemo(() => {
		if (!selectedLineData) return [];
		return linesContext.data?.routes.filter(route => selectedLineData.route_ids.includes(route.id)) ?? [];
	}, [selectedLineData]);

	useEffect(() => {
		(async () => {
			if (!selectedLineData) return;
			if (!operationalDateContext.data.selected_date) return;
			setIsLoading(true);
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedLineData.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.selected_date.operational_date);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult);
			setIsLoading(false);
		})();
	}, [lineId, selectedLineData]);

	useEffect(() => {
		(async () => {
			try {
				// Skip if no pattern id or no operational date
				if (!selectedPatternId || !operationalDateContext.data.selected_date?.operational_date) return;
				// Get current pattern version for the selected operational date
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(selectedPatternId, operationalDateContext.data.selected_date.operational_date);
				if (!validPatternData) return;
				setSelectedPatternData(validPatternData);
				// Skip if no shape id
				if (!validPatternData.shape_id) return;
				// Fetch shape data
				const shapeData = await linesContext.actions.getShapeDataById(validPatternData.shape_id);
				if (!shapeData) return console.log('No shape data found for shape ID', validPatternData.shape_id);
				setSelectedShapeData(shapeData);
			}
			catch (err) {
				console.error(err);
			}
		})();
	}, [selectedPatternId, operationalDateContext.data.selected_date?.operational_date]);

	//
	// D. Handle actions

	useEffect(() => {
		// Return early if no patterns are available
		if (!availablePatternsData || !availablePatternsData.length) return;
		// Pre-select the first pattern of the valid patterns if there is no filter value
		if (!selectedPatternId) setSelectedPatternId(availablePatternsData[0].id);
	}, [availablePatternsData, selectedPatternId]);

	const selectPatternId = (patternId: string) => {
		setSelectedPatternId(patternId);
	};

	const selectTripIds = (tripIds: string[] | undefined) => {
		setSelectedTripIds(tripIds);
	};

	const selectWaypointId = (stopId: string, stopSequence: number) => {
		// Return early if active waypoint is already selected
		if (selectedWaypointData?.stop_id === stopId && selectedWaypointData?.stop_sequence === stopSequence) return;
		// Find the waypoint in the active pattern that matches the stop id and stop sequence
		const foundWaypoint = selectedPatternData?.path.find(waypoint => waypoint.stop_id === stopId && waypoint.stop_sequence === stopSequence);
		// Update the state
		if (foundWaypoint) setSelectedWaypointData(foundWaypoint);
	};

	//
	// E. Define context value

	const contextValue: LineDetailContextState = useMemo(() => ({
		actions: {
			selectPatternId,
			selectTripIds,
			selectWaypointId,
		},
		data: {
			available_patterns: availablePatternsData,
			available_routes: availableRoutesData,
			selected_line: selectedLineData,
			selected_line_id: lineId,
			selected_pattern: selectedPatternData,
			selected_pattern_id: selectedPatternId,
			selected_shape: selectedShapeData,
			selected_trip_ids: selectedTripIds,
			selected_waypoint: selectedWaypointData,
		},
		flags: {
			loading: isLoading,
		},
	}), [
		lineId,
		isLoading,
		selectedTripIds,
		selectedLineData,
		selectedShapeData,
		selectedPatternId,
		availableRoutesData,
		selectedPatternData,
		selectedWaypointData,
		availablePatternsData,
	]);

	//
	// F. Render components

	return (
		<LineDetailContext.Provider value={contextValue}>
			{children}
		</LineDetailContext.Provider>
	);

	//
};
