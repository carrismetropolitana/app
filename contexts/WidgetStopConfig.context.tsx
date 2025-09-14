/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react';

/* * */

interface WidgetStopConfigContextState {
	actions: {
		clear: () => void
		confirm: () => void
		selectPatternId: (patternId: string) => void
		selectStopId: (stopId: string) => void
	}
	data: {
		selected_pattern_id: null | string
		selected_stop_id: null | string
	}
	flags: {
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
	const linesContext = useLinesContext();

	const [dataSelectedStopIdState, setDataSelectedStopIdState] = useState<null | string>(null);
	const [dataSelectedPatternIdState, setDataSelectedPatternIdState] = useState<null | string>(null);

	//
	// B. Fetch data

	// const { data: allAlertsData, isLoading: allAlertsLoading } = useSWR<Alert[], Error>(`${Routes.API}/alerts`);

	//
	// C. Transform data

	//
	// D. Handle actions

	const selectStopId = (stopId: string) => {
		setDataSelectedStopIdState(stopId);
	};

	const selectPatternId = (patternId: string) => {
		setDataSelectedPatternIdState(patternId);
	};

	const confirm = () => {
		console.log('confirmWidgetCreation');
	};

	const clear = () => {
		console.log('clearWidgetCreation');
	};

	//
	// E. Define context value

	const contextValue: WidgetStopConfigContextState = useMemo(() => ({
		actions: {
			clear,
			confirm,
			selectPatternId,
			selectStopId,
		},
		data: {
			selected_pattern_id: dataSelectedPatternIdState,
			selected_stop_id: dataSelectedStopIdState,
		},
		flags: {
			loading: false,
		},
	}), [
		dataSelectedPatternIdState,
		dataSelectedStopIdState,
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
