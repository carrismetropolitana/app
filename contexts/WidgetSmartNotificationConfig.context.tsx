/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { WidgetSmartNotification } from '@/types/widget.types';
import { type Line, type Pattern, type Waypoint } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetSmartNotificationConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectDistance: (distance: number) => void
		selectEndTime: (timeInSeconds: number) => void
		selectLineId: (lineId: string) => void
		selectPatternId: (patternId: string) => void
		selectStartTime: (timeInSeconds: number) => void
		selectWaypoint: (waypoint: Waypoint) => void
		selectWeekday: (weekday: WidgetSmartNotification['week_days'][number]) => void
	}
	data: {
		available_patterns: Pattern[]
		available_waypoints: Waypoint[]
		selected_distance: number
		selected_end_time: number
		selected_line: Line | undefined
		selected_line_id: string | undefined
		selected_pattern_id: string | undefined
		selected_start_time: number
		selected_waypoint: undefined | Waypoint
		selected_weekdays: WidgetSmartNotification['week_days']
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
	const operationalDateContext = useOperationalDateContext();

	const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();
	const [selectedWaypoint, setSelectedWaypoint] = useState<undefined | Waypoint>();
	const [selectedDistance, setSelectedDistance] = useState<number>(500);
	const [selectedWeekdays, setSelectedWeekdays] = useState<WidgetSmartNotification['week_days']>([]);
	const [selectedStartTime, setSelectedStartTime] = useState<number>(0);
	const [selectedEndTime, setSelectedEndTime] = useState<number>(86400);

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	//
	// C. Transform data

	const selectedLineData = useMemo(() => {
		if (!selectedLineId) return undefined;
		return linesContext.actions.getLineDataById(selectedLineId);
	}, [selectedLineId]);

	useEffect(() => {
		(async () => {
			if (!selectedLineData) return;
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedLineData.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.today.operational_date);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult);
		})();
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
		if (selectedWeekdays.length === 0) return false;
		if (selectedStartTime >= selectedEndTime) return false;
		// All good, we can save
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

	const selectWeekday = (weekday: WidgetSmartNotification['week_days'][number]) => {
		if (selectedWeekdays.includes(weekday)) {
			setSelectedWeekdays(selectedWeekdays.filter(item => item !== weekday));
		}
		else {
			setSelectedWeekdays([...selectedWeekdays, weekday]);
		}
	};

	const selectStartTime = (timeInSeconds: number) => {
		setSelectedStartTime(timeInSeconds);
	};

	const selectEndTime = (timeInSeconds: number) => {
		setSelectedEndTime(timeInSeconds);
	};

	const saveWidget = () => {
		// Skip if we don't have the required data
		if (!selectedLineId) return;
		if (!selectedPatternId) return;
		// Create the widget
		widgetContext.actions.createWidget({
			end_time: selectedEndTime,
			pattern_id: selectedPatternId,
			radius: selectedDistance,
			start_time: selectedStartTime,
			stop_id: selectedWaypoint?.stop_id ?? '',
			type: 'smart_notifications',
			week_days: selectedWeekdays,
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
			selectEndTime,
			selectLineId,
			selectPatternId,
			selectStartTime,
			selectWaypoint,
			selectWeekday,
		},
		data: {
			available_patterns: availablePatternsData,
			available_waypoints: availableWaypointsData,
			selected_distance: selectedDistance,
			selected_end_time: selectedEndTime,
			selected_line: selectedLineData,
			selected_line_id: selectedLineId,
			selected_pattern_id: selectedPatternId,
			selected_start_time: selectedStartTime,
			selected_waypoint: selectedWaypoint,
			selected_weekdays: selectedWeekdays,
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
		selectedEndTime,
		selectedStartTime,
		availableWaypointsData,
		selectedWeekdays,
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
