/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { generateRandomString } from '@/core-replica';
import { WidgetSchema } from '@/schemas/widgets';
import { HubStop, type HubPattern } from '@tmlmobilidade/go-types-public-info';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetStopConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectLabel: (label: string) => void
		selectStopId: (stopId: string) => void
		togglePatternId: (patternId: string) => void
		toggleSelectAll: () => void 
	} 
	data: {
		available_patterns: HubPattern[]
		selected_label: string
		selected_pattern_ids: string[] | undefined
		selected_stop: HubStop | undefined
		selected_stop_id: string | undefined
	}
	flags: {
		can_save: boolean
		loading: boolean
	}
}

/* * */

const WidgetStopConfigContext = createContext<undefined | WidgetStopConfigContextState>(undefined);

export function useWidgetStopConfigContext() {
	const context = useContext(WidgetStopConfigContext);
	if (!context) {
		throw new Error('useWidgetStopConfigContext must be used within a WidgetStopConfigContextProvider');
	}
	return context;
}

/* * */

export const WidgetStopConfigContextProvider = ({ children, widgetId }: PropsWithChildren<{ widgetId?: string }>) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const linesContext = useLinesContext();
	const accountContext = useAccountContext();
	const operationalDateContext = useOperationalDateContext();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [selectedStopId, setSelectedStopId] = useState<string | undefined>();
	const [selectedPatternIds, setSelectedPatternIds] = useState<string[] | undefined>();
	const [selectedLabel, setSelectedLabel] = useState<string>('');

	const [availablePatternsData, setAvailablePatternsData] = useState<HubPattern[]>([]);

	//
	// B. Transform data

	const selectedStopData = useMemo(() => {
		if (!selectedStopId) return undefined;
		return stopsContext.actions.getStopById(selectedStopId);
	}, [selectedStopId]);

	useEffect(() => {
		if (!selectedStopData) {
			setAvailablePatternsData([]);
			setIsLoading(false);
			return;
		}
		let cancelled = false;
		const promises = selectedStopData.pattern_ids.map(patternId => linesContext.actions.getValidPatternVersionForOperationalDate(patternId, operationalDateContext.data.today.operational_date_int));
		Promise.all(promises).then((results) => {
			if (cancelled) return;
			const fetchResult = results.filter(Boolean) as HubPattern[];
			setAvailablePatternsData(fetchResult);
			setIsLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [selectedStopId, selectedStopData]);

	const canSave = useMemo(() => {
		if (!selectedStopId) return false;
		if (!selectedPatternIds || selectedPatternIds.length === 0) return false;
		return true;
	}, [selectedPatternIds, selectedStopId]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no widget ID
		if (!widgetId) return;
		// Fetch existing widget data
		const existingWidget = accountContext.data.account?.widgets.find(widget => widget._id === widgetId);
		// Skip if not a stop widget
		if (existingWidget?.type !== 'stop') return;
		// Set existing data
		setSelectedLabel(existingWidget.settings.label || '');
		setSelectedStopId(existingWidget.properties.stop_id);
		setSelectedPatternIds(existingWidget.properties.pattern_ids);
	}, [widgetId]);

	const selectLabel = (label: string) => {
		setSelectedLabel(label.trim());
	};

	const selectStopId = (stopId: string) => {
		if (stopId === selectedStopId) return;
		setSelectedStopId(stopId);
		setSelectedPatternIds(undefined);
		setAvailablePatternsData([]);
	};

	const togglePatternId = (patternId: string) => {
		setSelectedPatternIds((prev) => {
			const set = new Set(prev);
			if (set.has(patternId)) set.delete(patternId);
			else set.add(patternId);
			return Array.from(set);
		});
	};

	const toggleSelectAll = () => {
		setSelectedPatternIds((prev) => {
			if (prev && prev.length === availablePatternsData.length) return [];
			return availablePatternsData.map(pattern => pattern._id);
		});
	};

	const saveWidget = () => {
		// Skip if account data is not available
		if (!accountContext.data.account) return;
		// Skip if we don't have the required data
		if (!selectedStopId) return;
		if (!selectedPatternIds) return;
		if (selectedPatternIds.length === 0) return;
		// Create the widget object
		const widgetObject = WidgetSchema.parse({
			_id: widgetId ?? generateRandomString(),
			properties: {
				pattern_ids: selectedPatternIds,
				stop_id: selectedStopId,
			},
			settings: {
				label: selectedLabel || null,
			},
			type: 'stop',
		});
		// Get a copy of existing widgets and filter out the widget to be updated
		const existingWidgets = [...accountContext.data.account.widgets].filter(item => item._id !== widgetObject._id);
		// Append new data to the existing widgets array.
		accountContext.actions.update('widgets', [...existingWidgets, widgetObject]);
	};

	const deleteWidget = () => {
		// Skip if account data is not available
		if (!accountContext.data.account) return;
		// Skip if we don't have a widget ID
		if (!widgetId) return;
		// Get a copy of existing widgets
		const existingWidgets = [...accountContext.data.account.widgets];
		// Filter out the widget to be deleted
		const updatedWidgets = existingWidgets.filter(widget => widget._id !== widgetId);
		// Update account data
		accountContext.actions.update('widgets', updatedWidgets);
	};

	//
	// D. Define context value

	const contextValue: WidgetStopConfigContextState = useMemo(() => ({
		actions: {
			deleteWidget,
			saveWidget,
			selectLabel,
			selectStopId,
			togglePatternId,
			toggleSelectAll,
		},
		data: {
			available_patterns: availablePatternsData,
			selected_label: selectedLabel,
			selected_pattern_ids: selectedPatternIds,
			selected_stop: selectedStopData,
			selected_stop_id: selectedStopId,
		},
		flags: {
			can_save: canSave,
			loading: isLoading,
		},
	}), [
		availablePatternsData,
		selectedPatternIds,
		selectedStopData,
		selectedStopId,
		selectedLabel,
		isLoading,
		canSave,
	]);

	//
	// E. Render components

	return (
		<WidgetStopConfigContext.Provider value={contextValue}>
			{children}
		</WidgetStopConfigContext.Provider>
	);

	//
};
