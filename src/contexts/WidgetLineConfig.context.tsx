/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { generateRandomString } from '@/core-replica';
import { WidgetSchema } from '@/schemas/widgets';
import { type Line, type Pattern } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetLineConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectLineId: (lineId: string) => void
		selectPatternId: (patternId: string) => void
	}
	data: {
		available_patterns: Pattern[]
		selected_line: Line | undefined
		selected_line_id: string | undefined
		selected_pattern_id: string | undefined
	}
	flags: {
		can_save: boolean
		loading: boolean
	}
}

/* * */

const WidgetLineConfigContext = createContext<undefined | WidgetLineConfigContextState>(undefined);

export function useWidgetLineConfigContext() {
	const context = useContext(WidgetLineConfigContext);
	if (!context) {
		throw new Error('useWidgetLineConfigContext must be used within a WidgetLineConfigContextProvider');
	}
	return context;
}

/* * */

export const WidgetLineConfigContextProvider = ({ children, widgetId }: PropsWithChildren<{ widgetId?: string }>) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const accountContext = useAccountContext();
	const operationalDateContext = useOperationalDateContext();

	const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	//
	// B. Transform data

	const selectedLineData = useMemo(() => {
		if (!selectedLineId) return;
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

	const canSave = useMemo(() => {
		if (!selectedLineId) return false;
		if (!selectedPatternId) return false;
		return true;
	}, [selectedPatternId, selectedLineId]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no widget ID
		if (!widgetId) return;
		// Fetch existing widget data
		const existingWidget = accountContext.data.account?.widgets.find(widget => widget._id === widgetId);
		// Skip if not a line widget
		if (existingWidget?.type !== 'line') return;
		// Fetch pattern data to validate the widget
		linesContext.actions.getValidPatternVersionForOperationalDate(existingWidget.properties.pattern_id).then((foundPatternData) => {
			// Skip if no pattern data found
			if (!foundPatternData) return;
			// Set existing data
			setSelectedLineId(foundPatternData.line_id);
			setSelectedPatternId(existingWidget.properties.pattern_id);
		});
	}, [widgetId]);

	const selectLineId = (lineId: string) => {
		if (lineId === selectedLineId) return;
		setSelectedLineId(lineId);
		setSelectedPatternId(undefined);
	};

	const selectPatternId = (patternId: string) => {
		setSelectedPatternId(patternId);
	};

	const saveWidget = () => {
		// Skip if account data is not available
		if (!accountContext.data.account) return;
		// Skip if we don't have the required data
		if (!selectedPatternId) return;
		// Create the widget object
		const widgetObject = WidgetSchema.parse({
			_id: widgetId ?? generateRandomString(),
			properties: {
				pattern_id: selectedPatternId,
			},
			type: 'line',
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

	const contextValue: WidgetLineConfigContextState = useMemo(() => ({
		actions: {
			deleteWidget,
			saveWidget,
			selectLineId,
			selectPatternId,
		},
		data: {
			available_patterns: availablePatternsData,
			selected_line: selectedLineData,
			selected_line_id: selectedLineId,
			selected_pattern_id: selectedPatternId,
		},
		flags: {
			can_save: canSave,
			loading: false,
		},
	}), [
		availablePatternsData,
		selectedLineId,
		selectedLineData,
		selectedPatternId,
		canSave,
	]);

	//
	// E. Render components

	return (
		<WidgetLineConfigContext.Provider value={contextValue}>
			{children}
		</WidgetLineConfigContext.Provider>
	);

	//
};
