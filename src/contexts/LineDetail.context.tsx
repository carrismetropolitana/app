/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type Line, type Pattern, type Shape, type Waypoint } from '@carrismetropolitana/api-types/network';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface LineDetailContextState {
	actions: {
		selectPattern: (patternId: string) => void
		selectTrip: (tripId: string) => void
		selectWaypoint: (stopId: string, stopSequence: number) => void
	}
	data: {
		available_patterns: Pattern[]
		selected_line: Line | undefined
		selected_lineId: string | undefined
		selected_pattern_id: string | undefined
		selected_shape: Shape | undefined
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

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();
	const [selectedTripId, setSelectedTripId] = useState<string | undefined>();

	const [selectedPatternVersion, setSelectedPatternVersion] = useState<Pattern | undefined>();
	const [selectedWaypoint, setSelectedWaypoint] = useState<undefined | Waypoint>();
	const [selectedShape, setSelectedShape] = useState<Shape | undefined>();

	//
	// B. Transform data

	const selectedLineData = useMemo(() => {
		if (!lineId) return;
		return linesContext.actions.getLineDataById(lineId);
	}, [lineId]);

	useEffect(() => {
		(async () => {
			if (!selectedLineData) return;
			if (!operationalDateContext.data.selected_date) return;
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedLineData.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.selected_date.operational_date);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult);
		})();
	}, [lineId, selectedLineData]);

	//
	// D. Handle actions

	/**
	 * Preselect a Pattern if there is no filter value.
	 * Return otherwise.
	 */
	useEffect(() => {
		// Return early if no patterns are available
		if (!availablePatternsData || !availablePatternsData.length) return;
		// Preselect the first pattern of the valid patterns if there is no filter value
		if (!selectedPatternId) {
			setSelectedPatternId(availablePatternsData[0].version_id);
		}
	}, [availablePatternsData, selectedPatternId]);

	const selectPattern = (patternId: string) => {
		setSelectedPatternId(patternId);
	};

	const selectTrip = (tripId: string) => {
		if (tripId === selectedTripId) setSelectedTripId(undefined);
		else setSelectedTripId(tripId);
	};

	const selectWaypoint = (stopId: string, stopSequence: number) => {
		// Return early if active waypoint is already selected
		if (selectedWaypoint?.stop_id === stopId && selectedWaypoint?.stop_sequence === stopSequence) return;
		// Find the waypoint in the active pattern that matches the stop id and stop sequence
		const foundWaypoint = selectedPatternVersion?.path.find(waypoint => waypoint.stop_id === stopId && waypoint.stop_sequence === stopSequence);
		// Update the state
		if (foundWaypoint) setSelectedWaypoint(foundWaypoint);
	};

	//
	// E. Define context value

	const contextValue: LineDetailContextState = useMemo(() => ({
		actions: {
			selectPattern,
			selectTrip,
			selectWaypoint,
		},
		data: {
			available_patterns: availablePatternsData,
			selected_line: selectedLineData,
			selected_lineId: lineId,
			selected_pattern_id: selectedPatternId,
			selected_shape: selectedShape,
			selected_waypoint: selectedWaypoint,
		},
		flags: {
			loading: false,
		},
	}), [
		availablePatternsData,
		lineId,
		selectedLineData,
		selectedPatternId,
		selectedShape,
		selectedWaypoint,
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
