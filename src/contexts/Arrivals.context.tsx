/* * */

import { Dates } from '@/core-replica';
import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type Arrival } from '@/schemas/realtime-arrival';
import { getServiceUrl } from '@/settings/service-urls';
import { type HubPattern } from '@tmlmobilidade/go-types-public-info';
import { type ApiResponse } from '@tmlmobilidade/types';
import { convertGTFSTimeStringAndOperationalDateToUnixTimestamp } from '@tmlmobilidade/utils';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

/* * */

interface ArrivalsContextProviderProps {
	limit?: number
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

interface HubEtaByStop {
	eta_at: null | string
	eta_seconds: null | string
	position_created_at: null | string
	stop_id: string
	trip_id: string
	vehicle_id: null | string
}

/* * */

function getTripIdWithoutAgency(tripId: string): string {
	return tripId.substring(tripId.indexOf(']') + 1);
}

function getEstimatedArrivalMilliseconds(eta: HubEtaByStop | undefined): number | undefined {
	if (!eta) return;

	const positionCreatedAt = Number(eta.position_created_at);
	const etaSeconds = Number(eta.eta_seconds);
	if (Number.isFinite(positionCreatedAt) && Number.isFinite(etaSeconds)) {
		return positionCreatedAt + Math.round(etaSeconds) * 1000;
	}

	if (!eta.eta_at) return;
	const etaAtNumber = Number(eta.eta_at);
	if (Number.isFinite(etaAtNumber)) return etaAtNumber;

	const etaAtMilliseconds = Date.parse(eta.eta_at);
	return Number.isFinite(etaAtMilliseconds) ? etaAtMilliseconds : undefined;
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

export const ArrivalsContextProvider = ({ children, limit, patternIds, stopId }: PropsWithChildren<ArrivalsContextProviderProps>) => {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const operationalDateContext = useOperationalDateContext();
	const selectedOperationalDate = operationalDateContext.data.selected_date?.operational_date;
	const selectedOperationalDateInt = operationalDateContext.data.selected_date?.operational_date_int;

	const patternIdsKey = patternIds?.join('|');

	const [patternsData, setPatternsData] = useState<HubPattern[]>([]);
	const [patternsLoading, setPatternsLoading] = useState(false);

	//
	// B. Fetch data

	const etaApiUrl = operationalDateContext.flags.today && stopId
		? `${getServiceUrl('go_api_url')}/hub/api/v1/realtime/eta/by-stop/${encodeURIComponent(stopId)}`
		: null;
	const { data: etaResponse, isLoading: etaLoading } = useSWR<ApiResponse<HubEtaByStop[]>>(etaApiUrl, { refreshInterval: 30_000 });
	const etaData = Array.isArray(etaResponse?.data) ? etaResponse.data : [];

	useEffect(() => {
		const requestedPatternIds = patternIdsKey?.split('|') ?? [];
		if (!requestedPatternIds.length || !selectedOperationalDateInt) {
			setPatternsData([]);
			setPatternsLoading(false);
			return;
		}

		let cancelled = false;
		setPatternsLoading(true);
		void Promise.all(requestedPatternIds.map(patternId => linesContext.actions.getValidPatternVersionForOperationalDate(patternId, selectedOperationalDateInt)))
			.then((patterns) => {
				if (cancelled) return;
				setPatternsData(patterns.filter((pattern): pattern is HubPattern => !!pattern));
			})
			.catch(() => {
				if (!cancelled) setPatternsData([]);
			})
			.finally(() => {
				if (!cancelled) setPatternsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [linesContext.actions, patternIdsKey, selectedOperationalDateInt]);

	//
	// C. Transform data

	const scheduledArrivalsData = useMemo<Arrival[]>(() => {
		if (!selectedOperationalDate || !patternsData.length) return [];

		return patternsData.flatMap((patternData) => {
			if (!patternData.valid_on.includes(selectedOperationalDate)) return [];
			const lastStopSequence = patternData.path[patternData.path.length - 1]?.stop_sequence;

			return patternData.trips.flatMap((tripData) => {
				if (!tripData.valid_on.includes(selectedOperationalDate)) return [];
				const stopTime = tripData.schedule.find(item => String(item.stop_id) === String(stopId));
				if (!stopTime || stopTime.stop_sequence === lastStopSequence) return [];

				const scheduledArrivalUnix = Math.floor(convertGTFSTimeStringAndOperationalDateToUnixTimestamp(stopTime.arrival_time, selectedOperationalDate) / 1000);
				const tripId = tripData.trip_ids[0] ?? '';
				const eta = operationalDateContext.flags.today
					? etaData.find(item => String(item.stop_id) === String(stopId) && tripData.trip_ids.some(id => getTripIdWithoutAgency(id) === getTripIdWithoutAgency(item.trip_id)))
					: undefined;
				const estimatedArrivalMilliseconds = getEstimatedArrivalMilliseconds(eta);
				const estimatedArrivalUnix = estimatedArrivalMilliseconds === undefined ? null : Math.floor(estimatedArrivalMilliseconds / 1000);

				return {
					estimated_arrival: null,
					estimated_arrival_unix: estimatedArrivalUnix,
					headsign: patternData.headsign,
					line_id: patternData.line_id,
					observed_arrival: null,
					observed_arrival_unix: null,
					pattern_id: patternData._id,
					route_id: patternData.route_id,
					scheduled_arrival: stopTime.arrival_time,
					scheduled_arrival_unix: scheduledArrivalUnix,
					status: estimatedArrivalUnix === null ? 'scheduled' : 'realtime',
					stop_sequence: stopTime.stop_sequence,
					trip_id: eta?.trip_id ?? tripId,
					vehicle_id: eta?.vehicle_id ?? null,
				};
			});
		});
	}, [etaData, operationalDateContext.flags.today, patternsData, selectedOperationalDate, stopId]);

	const futureArrivalsData = useMemo(() => {
		const nowInUnixSeconds = Dates.now('Europe/Lisbon').unix_timestamp / 1000;
		return scheduledArrivalsData.filter((arrival) => {
			if (arrival.observed_arrival_unix) return false;
			const arrivalTime = arrival.estimated_arrival_unix ?? arrival.scheduled_arrival_unix;
			return arrivalTime >= nowInUnixSeconds;
		});
	}, [scheduledArrivalsData]);

	const sortedArrivalsData = useMemo(() => {
		return [...futureArrivalsData]
			.sort((a, b) => {
				const aArrival = a.estimated_arrival_unix ?? a.scheduled_arrival_unix;
				const bArrival = b.estimated_arrival_unix ?? b.scheduled_arrival_unix;
				return aArrival - bArrival;
			})
			.slice(0, limit || futureArrivalsData.length);
	}, [futureArrivalsData, limit]);

	//
	// D. Context value

	const contextValue: ArrivalsContextState = useMemo(() => ({
		data: {
			arrivals: sortedArrivalsData,
			stop_id: stopId,
		},
		flags: {
			loading: patternsLoading || etaLoading,
		},
	}), [
		etaLoading,
		patternsLoading,
		sortedArrivalsData,
		stopId,
	]);

	//
	// E. Render components

	return (
		<ArrivalsContext.Provider value={contextValue}>
			{children}
		</ArrivalsContext.Provider>
	);

	//
};
