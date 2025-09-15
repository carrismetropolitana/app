/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { type Line, type Pattern, type Waypoint } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetSmartNotificationConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectDistance: (distance: number) => void
		selectLineId: (lineId: string) => void
		selectPatternId: (patternId: string) => void
		selectWaypoint: (waypoint: Waypoint) => void
	}
	data: {
		available_patterns: Pattern[]
		available_waypoints: Waypoint[]
		selected_distance: number
		selected_line: Line | undefined
		selected_line_id: string | undefined
		selected_pattern_id: string | undefined
		selected_waypoint: undefined | Waypoint
	}
	flags: {
		can_save: boolean
		loading: boolean
	}
}

/* * */

const WidgetSmartNotificationConfigContext = createContext<undefined | WidgetSmartNotificationConfigContextState>(undefined);

export function useWidgetSmartNotificationConfigContext() {
	const context = useContext(WidgetSmartNotificationConfigContext);
	if (!context) {
		throw new Error('useWidgetSmartNotificationConfigContext must be used within a WidgetSmartNotificationConfigContextProvider');
	}
	return context;
}

/* * */

export const WidgetSmartNotificationConfigContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const widgetContext = useWidgetContext();

	const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();
	const [selectedWaypoint, setSelectedWaypoint] = useState<undefined | Waypoint>();
	const [selectedDistance, setSelectedDistance] = useState<number>(500);

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	//
	// C. Transform data

	const selectedLineData = useMemo(() => {
		if (!selectedLineId) return undefined;
		return linesContext.actions.getLineDataById(selectedLineId);
	}, [selectedLineId]);

	useEffect(() => {
		const fetchPatterns = async () => {
			if (!selectedLineData) return;
			const today = '20250915';
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedLineData.pattern_ids) {
				const result = await fetch(`https://api.carrismetropolitana.pt/v2/patterns/${patternId}`);
				const patternData: Pattern[] = await result.json();
				for (const element of patternData) {
					if (element.valid_on.includes(today)) {
						fetchResult.push(element);
					}
				}
			}
			setAvailablePatternsData(fetchResult);
		};
		fetchPatterns();
	}, [selectedLineId, selectedLineData]);

	const availableWaypointsData = useMemo(() => {
		if (!selectedPatternId) return [];
		const selectedPattern = availablePatternsData.find(item => item.id === selectedPatternId);
		if (!selectedPattern) return [];
		return selectedPattern.path;
	}, [availablePatternsData, selectedPatternId]);

	const canSave = useMemo(() => {
		if (!selectedLineId) return false;
		if (!selectedPatternId) return false;
		if (!selectedWaypoint) return false;
		if (!selectedDistance || selectedDistance < 500) return false;
		return true;
	}, [selectedPatternId, selectedLineId, selectedWaypoint, selectedDistance]);

	//
	// D. Handle actions

	const selectLineId = (lineId: string) => {
		setSelectedLineId(lineId);
	};

	const selectPatternId = (patternId: string) => {
		setSelectedPatternId(patternId);
	};

	const selectWaypoint = (waypoint: Waypoint) => {
		setSelectedWaypoint(waypoint);
	};

	const selectDistance = (distance: number) => {
		setSelectedDistance(distance);
	};

	const saveWidget = () => {
		// Skip if we don't have the required data
		if (!selectedLineId) return;
		if (!selectedPatternId) return;
		// Create the widget
		widgetContext.actions.createWidget({
			pattern_ids: [selectedPatternId],
			type: 'lines',
		});
	};

	const deleteWidget = () => {
		console.log('deleteWidget');
	};

	//
	// E. Define context value

	const contextValue: WidgetSmartNotificationConfigContextState = useMemo(() => ({
		actions: {
			deleteWidget,
			saveWidget,
			selectDistance,
			selectLineId,
			selectPatternId,
			selectWaypoint,
		},
		data: {
			available_patterns: availablePatternsData,
			available_waypoints: availableWaypointsData,
			selected_distance: selectedDistance,
			selected_line: selectedLineData,
			selected_line_id: selectedLineId,
			selected_pattern_id: selectedPatternId,
			selected_waypoint: selectedWaypoint,
		},
		flags: {
			can_save: canSave,
			loading: false,
		},
	}), [
		availablePatternsData,
		selectedDistance,
		selectedLineId,
		selectedLineData,
		availableWaypointsData,
		selectedWaypoint,
		selectedPatternId,
		canSave,
	]);

	//
	// F. Render components

	return (
		<WidgetSmartNotificationConfigContext.Provider value={contextValue}>
			{children}
		</WidgetSmartNotificationConfigContext.Provider>
	);

	//
};
