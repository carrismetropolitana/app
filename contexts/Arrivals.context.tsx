/* * */

import { Dates, type HttpException } from '@/core-replica';
import { type Arrival } from '@/schemas/realtime-arrival';
import { getServiceUrl } from '@/settings/service-urls';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';
import useSWR from 'swr';

/* * */

interface ArrivalsContextProviderProps {
	limit?: number
	onlyFuture?: boolean
	patternIds?: string[]
	stopId: string
}

/* * */

interface ArrivalsContextState {
	data: {
		arrivals: Arrival[]
		stop_id: string
	}
	flags: {
		loading: boolean
	}
}

/* * */

const ArrivalsContext = createContext<ArrivalsContextState | undefined>(undefined);

export function useArrivalsContext() {
	const context = useContext(ArrivalsContext);
	if (!context) {
		throw new Error('useArrivalsContext must be used within a ArrivalsContextProvider');
	}
	return context;
}

/* * */

export const ArrivalsContextProvider = ({ children, limit, onlyFuture, patternIds, stopId }: PropsWithChildren<ArrivalsContextProviderProps>) => {
	//

	//
	// A. Fetch data

	const { data: arrivalsData, isLoading: arrivalsLoading } = useSWR<Arrival[], HttpException>(`${getServiceUrl('api')}/v2/arrivals/by_stop/${stopId}`, { refreshInterval: 10_000 });

	//
	// B. Transform data

	const filteredArrivalsByPatternIds = useMemo(() => {
		// Skip if no data
		if (!arrivalsData) return [];
		// Skip if no pattern IDs to filter by
		if (!patternIds || patternIds.length === 0) return arrivalsData;
		// Filter by pattern IDs
		return arrivalsData.filter(arrival => patternIds.includes(arrival.pattern_id));
	}, [arrivalsData, patternIds]);

	const filteredArrivalsByOnlyFuture = useMemo(() => {
		// Skip if no data
		if (!filteredArrivalsByPatternIds) return [];
		// Skip if not filtering by only future
		if (!onlyFuture) return filteredArrivalsByPatternIds;
		// Get current time in unix seconds
		const nowInUnixSeconds = Dates.now('Europe/Lisbon').unix_timestamp / 1000;
		// Filter by only future arrivals
		return filteredArrivalsByPatternIds.filter((arrival) => {
			// If the arrival has an observed arrival time,
			// then it means the vehicle has already passed the stop.
			if (arrival.observed_arrival_unix) return false;
			// If the arrival has an estimated arrival time,
			// then include it in the past if the estimated arrival time is in the past.
			if (arrival.estimated_arrival_unix && arrival.estimated_arrival_unix < nowInUnixSeconds) return false;
			// If the arrival has no estimated arrival time but has a scheduled arrival time,
			// then include it in the past if the scheduled arrival time is in the past.
			if (arrival.scheduled_arrival_unix < nowInUnixSeconds) return false;
			// Otherwise, include it.
			return true;
		});
	}, [filteredArrivalsByPatternIds]);

	const sortedArrivalsData = useMemo(() => {
		// Skip if no data
		if (!filteredArrivalsByOnlyFuture) return [];
		// Sort by estimated arrival time (or scheduled arrival time if no estimated arrival time)
		const sorted = filteredArrivalsByOnlyFuture.sort((a, b) => {
			const aArrival = a.estimated_arrival_unix || a.scheduled_arrival_unix;
			const bArrival = b.estimated_arrival_unix || b.scheduled_arrival_unix;
			return aArrival - bArrival;
		});
		// Limit the number of arrivals if limit is set
		return sorted.slice(0, limit || sorted.length);
	}, [filteredArrivalsByOnlyFuture]);

	const enrichedArrivalsData = useMemo(() => {
		// Skip if no data
		if (!sortedArrivalsData) return [];
		// Enrich each arrival with its status
		return sortedArrivalsData.map((arrival): Arrival => {
			// If the arrival has an observed arrival time,
			// it means the vehicle has already passed the stop.
			if (arrival.observed_arrival_unix) return { ...arrival, status: 'observed' };
			// If the arrival has an estimated arrival time,
			// it means the vehicle is approaching the stop.
			else if (arrival.estimated_arrival_unix) return { ...arrival, status: 'realtime' };
			// Otherwise, it's a scheduled arrival.
			else return { ...arrival, status: 'scheduled' };
		});
	}, [sortedArrivalsData]);

	//
	// C. Context value

	const contextValue: ArrivalsContextState = useMemo(() => ({
		data: {
			arrivals: enrichedArrivalsData,
			stop_id: stopId,
		},
		flags: {
			loading: arrivalsLoading,
		},
	}), [
		stopId,
		enrichedArrivalsData,
		arrivalsLoading,
	]);

	//
	// D. Render components

	return (
		<ArrivalsContext.Provider value={contextValue}>
			{children}
		</ArrivalsContext.Provider>
	);

	//
};
