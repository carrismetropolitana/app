/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { Dates } from '@tmlmobilidade/dates';
import {type HubPattern } from '@tmlmobilidade/go-types-public-info';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface PatternSelectionContextProviderProps {
	selectedLineId?: string
	selectedOperationalDate?: Dates
}

/* * */

interface PatternSelectionContextState {
	data: {
		available: HubPattern[]
	}
	flags: {
		loading: boolean
	}
}

/* * */

const PatternSelectionContext = createContext<PatternSelectionContextState | undefined>(undefined);

export const usePatternSelectionContext = () => {
	const context = useContext(PatternSelectionContext);
	if (!context) {
		throw new Error('usePatternSelectionContext must be used within a PatternSelectionContextProvider');
	}
	return context;
};

/* * */

export const PatternSelectionContextProvider = ({ children, selectedLineId, selectedOperationalDate }: PropsWithChildren<PatternSelectionContextProviderProps>) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();

	const [isLoading, setIsLoading] = useState(false);
	const [availablePatternsData, setAvailablePatternsData] = useState<HubPattern[]>([]);

	//
	// B. Transform data

	const selectedLineData = useMemo(() => {
		if (!selectedLineId) return;
		return linesContext.actions.getLineDataById(selectedLineId);
	}, [linesContext.actions, selectedLineId]);

	useEffect(() => {
		(async () => {
			if (!selectedLineData) return;
			setIsLoading(true);
			const fetchResult: HubPattern[] = [];
			for (const patternId of selectedLineData.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId, selectedOperationalDate?.operational_date_int);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult.sort((a, b) => a._id.localeCompare(b._id)));
			setIsLoading(false);
		})();
	}, [linesContext.actions, selectedLineData, selectedOperationalDate]);

	//
	// C. Define context value

	const contextValue: PatternSelectionContextState = useMemo(() => ({
		data: {
			available: availablePatternsData,
		},
		flags: {
			loading: linesContext.flags.loading || isLoading,
		},
	}), [
		isLoading,
		availablePatternsData,
		linesContext.flags.loading,
	]);

	//
	// D. Render components

	return (
		<PatternSelectionContext.Provider value={contextValue}>
			{children}
		</PatternSelectionContext.Provider>
	);

	//
};
