/* * */

import { useStopsContext } from '@/contexts/Stops.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { Pattern, type Stop } from '@carrismetropolitana/api-types/network';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface WidgetStopConfigContextState {
	actions: {
		confirmWidget: () => void
		deleteWidget: () => void
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

	const widgetContext = useWidgetContext();
	const stopsContext = useStopsContext();

	const [dataSelectedStopIdState, setDataSelectedStopIdState] = useState<string | undefined>();
	const [dataSelectedPatternIdsState, setDataSelectedPatternIdsState] = useState<string[] | undefined>();

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);

	//
	// B. Fetch data

	// const { data: allAlertsData, isLoading: allAlertsLoading } = useSWR<Alert[], Error>(`${Routes.API}/alerts`);

	//
	// C. Transform data

	const selectedStopData = useMemo(() => {
		if (!dataSelectedStopIdState) return undefined;
		return stopsContext.actions.getStopById(dataSelectedStopIdState);
	}, [dataSelectedStopIdState]);

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
	}, [dataSelectedStopIdState, selectedStopData]);

	const canSave = useMemo(() => {
		if (!dataSelectedStopIdState) return false;
		if (!dataSelectedPatternIdsState || dataSelectedPatternIdsState.length === 0) return false;
		return true;
	}, [dataSelectedPatternIdsState, dataSelectedStopIdState]);

	//
	// D. Handle actions

	const selectStopId = (stopId: string) => {
		setDataSelectedStopIdState(stopId);
	};

	const togglePatternId = (patternId: string) => {
		setDataSelectedPatternIdsState((prev) => {
			const set = new Set(prev);
			if (set.has(patternId)) set.delete(patternId);
			else set.add(patternId);
			return Array.from(set);
		});
	};

	const toggleSelectAll = () => {
		setDataSelectedPatternIdsState((prev) => {
			if (prev && prev.length === availablePatternsData.length) return [];
			return availablePatternsData.map(pattern => pattern.id);
		});
	};

	const confirmWidget = () => {
		if (!dataSelectedStopIdState || !dataSelectedPatternIdsState || dataSelectedPatternIdsState.length === 0) {
			return;
		}
		widgetContext.actions.createWidget({
			pattern_ids: dataSelectedPatternIdsState,
			stopId: dataSelectedStopIdState,
			type: 'stops',
		});
		console.log('confirmWidgetCreation');
	};

	const deleteWidget = () => {
		console.log('deleteWidget');
	};

	//
	// E. Define context value

	const contextValue: WidgetStopConfigContextState = useMemo(() => ({
		actions: {
			confirmWidget,
			deleteWidget,
			selectStopId,
			togglePatternId,
			toggleSelectAll,
		},
		data: {
			available_patterns: availablePatternsData,
			selected_pattern_ids: dataSelectedPatternIdsState,
			selected_stop: selectedStopData,
			selected_stop_id: dataSelectedStopIdState,
		},
		flags: {
			can_save: canSave,
			loading: false,
		},
	}), [
		dataSelectedPatternIdsState,
		dataSelectedStopIdState,
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
