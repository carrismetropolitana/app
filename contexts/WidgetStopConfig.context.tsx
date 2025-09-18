/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { generateRandomString } from '@/core-replica';
import { WidgetSchema } from '@/schemas/widgets';
import { Pattern, type Stop } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { useAccountContext } from './Account.context';

/* * */

interface WidgetStopConfigContextState {
	actions: {
		deleteWidget: () => void
		saveWidget: () => void
		selectStopId: (stopId: string) => void
		togglePatternId: (patternId: string) => void
		toggleSelectAll: () => void
	}
	data: {
		available_patterns: Pattern[]
		selected_pattern_ids: string[] | undefined
		selected_stop: Stop | undefined
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

export const WidgetStopConfigContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const accountContext = useAccountContext();

	const [selectedStopId, setSelectedStopId] = useState<string | undefined>();
	const [selectedPatternIds, setSelectedPatternIds] = useState<string[] | undefined>();

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	//
	// C. Transform data

	const selectedStopData = useMemo(() => {
		if (!selectedStopId) return undefined;
		return stopsContext.actions.getStopById(selectedStopId);
	}, [selectedStopId]);

	useEffect(() => {
		const fetchPatterns = async () => {
			if (!selectedStopData) return;
			const today = '20250915';
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedStopData.pattern_ids) {
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
	}, [selectedStopId, selectedStopData]);

	const canSave = useMemo(() => {
		if (!selectedStopId) return false;
		if (!selectedPatternIds || selectedPatternIds.length === 0) return false;
		return true;
	}, [selectedPatternIds, selectedStopId]);

	//
	// D. Handle actions

	const selectStopId = (stopId: string) => {
		setSelectedStopId(stopId);
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
			return availablePatternsData.map(pattern => pattern.id);
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
			_id: generateRandomString(),
			properties: {
				pattern_ids: selectedPatternIds,
				stop_id: selectedStopId,
			},
			type: 'stop',
		});
		// Save the widget
		accountContext.actions.update('widgets', [...accountContext.data.account.widgets, widgetObject]);
	};

	const deleteWidget = () => {
		console.log('deleteWidget');
	};

	//
	// E. Define context value

	const contextValue: WidgetStopConfigContextState = useMemo(() => ({
		actions: {
			deleteWidget,
			saveWidget,
			selectStopId,
			togglePatternId,
			toggleSelectAll,
		},
		data: {
			available_patterns: availablePatternsData,
			selected_pattern_ids: selectedPatternIds,
			selected_stop: selectedStopData,
			selected_stop_id: selectedStopId,
		},
		flags: {
			can_save: canSave,
			loading: false,
		},
	}), [
		selectedPatternIds,
		selectedStopId,
		availablePatternsData,
		selectedStopData,
		canSave,
	]);

	//
	// F. Render components

	return (
		<WidgetStopConfigContext.Provider value={contextValue}>
			{children}
		</WidgetStopConfigContext.Provider>
	);

	//
};
