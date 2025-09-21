/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { generateRandomString } from '@/core-replica';
import { WidgetSchema, WidgetSmartNotification } from '@/schemas/widgets';
import { type Line, type Pattern, type Waypoint } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetSmartNotificationConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectDistance: (distance: number) => void
		selectEndTime: (timeInSeconds: number) => void
		selectLabel: (label: string) => void
		selectLineId: (lineId: string) => void
		selectPatternId: (patternId: string) => void
		selectStartTime: (timeInSeconds: number) => void
		selectWaypoint: (waypoint: Waypoint) => void
		selectWeekday: (weekday: WidgetSmartNotification['properties']['weekdays'][number]) => void
	}
	data: {
		available_patterns: Pattern[]
		available_waypoints: Waypoint[]
		selected_distance: number
		selected_end_time: number
		selected_label: string
		selected_line: Line | undefined
		selected_line_id: string | undefined
		selected_pattern_id: string | undefined
		selected_start_time: number
		selected_waypoint: undefined | Waypoint
		selected_weekdays: WidgetSmartNotification['properties']['weekdays'][number][]
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
	const accountContext = useAccountContext();
	const operationalDateContext = useOperationalDateContext();

	const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();
	const [selectedWaypoint, setSelectedWaypoint] = useState<undefined | Waypoint>();
	const [selectedDistance, setSelectedDistance] = useState<number>(500);
	const [selectedWeekdays, setSelectedWeekdays] = useState<WidgetSmartNotification['properties']['weekdays'][number][]>([]);
	const [selectedStartTime, setSelectedStartTime] = useState<number>(0);
	const [selectedEndTime, setSelectedEndTime] = useState<number>(86400);
	const [selectedLabel, setSelectedLabel] = useState<string>('');

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
		console.log('canSave recompute', {
			selectedDistance,
			selectedEndTime,
			selectedLineId,
			selectedPatternId,
			selectedStartTime,
			selectedWaypoint,
			selectedWeekdays,
		});
		if (!selectedLineId) return false;
		if (!selectedPatternId) return false;
		if (!selectedWaypoint) return false;
		if (!selectedDistance || selectedDistance < 500) return false;
		if (selectedWeekdays.length === 0) return false;
		if (selectedStartTime >= selectedEndTime) return false;
		// All good, we can save
		return true;
	}, [
		selectedDistance,
		selectedEndTime,
		selectedLineId,
		selectedPatternId,
		selectedStartTime,
		selectedWaypoint,
		selectedWeekdays,
	]);

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

	const selectWeekday = (weekday: WidgetSmartNotification['properties']['weekdays'][number]) => {
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

	const selectLabel = (label: string) => {
		setSelectedLabel(label.trim());
	};

	const saveWidget = () => {
		// Skip if account data is not available
		if (!accountContext.data.account) return;
		// Skip if we don't have the required data
		if (!canSave) return;
		if (!selectedLineId) return;
		if (!selectedPatternId) return;
		if (!selectedWaypoint) return;
		// Create the widget object
		const widgetObject = WidgetSchema.parse({
			_id: generateRandomString(),
			properties: {
				distance: selectedDistance,
				end_time: selectedEndTime,
				line_id: selectedLineId,
				pattern_id: selectedPatternId,
				start_time: selectedStartTime,
				stop_id: selectedWaypoint.stop_id,
				stop_sequence: selectedWaypoint.stop_sequence,
				weekdays: selectedWeekdays,
			},
			settings: {
				label: selectedLabel || null,
			},
			type: 'smart_notification',
		});
		// Save the widget
		accountContext.actions.update('widgets', [...accountContext.data.account.widgets, widgetObject]);
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
			selectLabel,
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
			selected_label: selectedLabel,
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
		selectedLabel,
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
