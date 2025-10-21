/* * */

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { type SimplifiedAlert } from '@/types/alerts.types';
import { type Pattern, type Stop } from '@carrismetropolitana/api-types/network';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface StopDetailContextState {
	data: {
		active_alerts: SimplifiedAlert[]
		available_patterns: Pattern[]
		selected_stop: Stop | undefined
		selected_stop_id: string | undefined
	}
	flags: {
		loading: boolean
	}
}

/* * */

const StopDetailContext = createContext<StopDetailContextState | undefined>(undefined);

export function useStopDetailContext() {
	const context = useContext(StopDetailContext);
	if (!context) {
		throw new Error('useStopDetailContext must be used within a StopDetailContextProvider');
	}
	return context;
}

/* * */

export const StopDetailContextProvider = ({ children, stopId }: PropsWithChildren<{ stopId: string }>) => {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const linesContext = useLinesContext();
	const alertsContext = useAlertsContext();

	const [availablePatternsData, setAvailablePatternsData] = useState<Pattern[]>([]);
	const [activeAlertsState, setActiveAlertsState] = useState<SimplifiedAlert[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	//
	// B. Transform data

	const selectedStopData = useMemo(() => {
		if (!stopId) return;
		return stopsContext.actions.getStopById(stopId);
	}, [stopId]);

	useEffect(() => {
		(async () => {
			if (!selectedStopData) return;
			setIsLoading(true);
			const fetchResult: Pattern[] = [];
			for (const patternId of selectedStopData.pattern_ids) {
				const validPatternData = await linesContext.actions.getValidPatternVersionForOperationalDate(patternId);
				if (validPatternData) fetchResult.push(validPatternData);
			}
			setAvailablePatternsData(fetchResult);
			setIsLoading(false);
		})();
	}, [selectedStopData]);

	useEffect(() => {
		if (!alertsContext.data.simplified) return;
		const activeAlerts = alertsContext.data.simplified.filter((simplifiedAlertData) => {
			return simplifiedAlertData.informed_entity.some((informedEntity) => {
				if (!informedEntity.stop_id && !informedEntity.route_id) return false;
				const hasMatchingStop = informedEntity.stop_id === selectedStopData?.id;
				const hasMatchingRoute = selectedStopData?.route_ids.includes(informedEntity.route_id || '');
				const isActive = simplifiedAlertData.end_date ? simplifiedAlertData.end_date >= new Date() : true;
				return (hasMatchingStop || hasMatchingRoute) && isActive;
			});
		});
		setActiveAlertsState(activeAlerts);
	}, [alertsContext.data.simplified, selectedStopData]);

	//
	// C. Define context value

	const contextValue: StopDetailContextState = useMemo(() => ({
		data: {
			active_alerts: activeAlertsState,
			available_patterns: availablePatternsData,
			selected_stop: selectedStopData,
			selected_stop_id: stopId,
		},
		flags: {
			loading: isLoading,
		},
	}), [
		isLoading,
		selectedStopData,
		availablePatternsData,
	]);

	//
	// D. Render components

	return (
		<StopDetailContext.Provider value={contextValue}>
			{children}
		</StopDetailContext.Provider>
	);

	//
};
