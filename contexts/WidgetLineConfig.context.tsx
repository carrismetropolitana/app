/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useWidgetContext } from '@/contexts/Widget.context';
import { type Pattern } from '@carrismetropolitana/api-types/network';
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

export const WidgetLineConfigContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const widgetContext = useWidgetContext();

	const [selectedLineId, setSelectedLineId] = useState<string | undefined>();
	const [selectedPatternId, setSelectedPatternId] = useState<string | undefined>();

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

	const canSave = useMemo(() => {
		if (!selectedLineId) return false;
		if (!selectedPatternId) return false;
		return true;
	}, [selectedPatternId, selectedLineId]);

	//
	// D. Handle actions

	const selectLineId = (lineId: string) => {
		setSelectedLineId(lineId);
	};

	const selectPatternId = (patternId: string) => {
		setSelectedPatternId(patternId);
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

	const contextValue: WidgetLineConfigContextState = useMemo(() => ({
		actions: {
			deleteWidget,
			saveWidget,
			selectLineId,
			selectPatternId,
		},
		data: {
			available_patterns: availablePatternsData,
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
		selectedPatternId,
		canSave,
	]);

	//
	// F. Render components

	return (
		<WidgetLineConfigContext.Provider value={contextValue}>
			{children}
		</WidgetLineConfigContext.Provider>
	);

	//
};
