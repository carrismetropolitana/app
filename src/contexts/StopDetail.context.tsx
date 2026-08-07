/* * */

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { normalizeReferenceId } from '@/utils/alerts';
import type { HubAlert, HubPattern, HubStop } from '@tmlmobilidade/go-types-public-info';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface StopDetailContextState {
	data: {
		active_alerts: HubAlert[]
		available_patterns: HubPattern[]
		selected_stop: HubStop | undefined
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

	const [availablePatternsData, setAvailablePatternsData] = useState<HubPattern[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	//
	// B. Transform data

	const selectedStopData = useMemo(() => {
		if (!stopId) return;
		return stopsContext.actions.getStopById(stopId);
	}, [stopId]);

	useEffect(() => {
		if (!selectedStopData) {
			setAvailablePatternsData([]);
			setIsLoading(false);
			return;
		}
		let cancelled = false;
		setIsLoading(true);
		const promises = selectedStopData.pattern_ids.map(patternId => linesContext.actions.getValidPatternVersionForOperationalDate(patternId));
		Promise.all(promises).then((results) => {
			// if (cancelled) return;
			const fetchResult = results.filter(Boolean) as HubPattern[];
			setAvailablePatternsData(fetchResult);
			setIsLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [selectedStopData]);

	const activeAlertsData = useMemo(() => {
		if (!selectedStopData) return [];

		const normalizedStopId = normalizeReferenceId(stopId);
		const normalizedLineIds = new Set(selectedStopData.line_ids.map(normalizeReferenceId));

		return alertsContext.data.alerts.filter((alert) => {
			const hasMatchingReference = alert.references.some((reference) => {
				if (alert.reference_type === 'stops') return normalizeReferenceId(reference.parent_id) === normalizedStopId;
				if (alert.reference_type !== 'lines') return false;

				const hasMatchingLine = normalizedLineIds.has(normalizeReferenceId(reference.parent_id));
				const hasMatchingStop = reference.child_ids.some(childId => normalizeReferenceId(childId) === normalizedStopId);
				return hasMatchingLine || hasMatchingStop;
			});
			const isActive = !alert.active_period_end_date || alert.active_period_end_date >= Date.now();
			return hasMatchingReference && isActive;
		});
	}, [alertsContext.data.alerts, selectedStopData, stopId]);

	//
	// C. Define context value

	const contextValue: StopDetailContextState = useMemo(() => ({
		data: {
			active_alerts: activeAlertsData,
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
		activeAlertsData,
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
