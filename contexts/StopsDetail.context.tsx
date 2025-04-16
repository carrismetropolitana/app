import type { SimplifiedAlert } from '@/types/alerts.types';
import type { Arrival } from '@/types/stops.types';
import type { Line, Pattern, Shape, Stop } from '@carrismetropolitana/api-types/network';

import { useAlertsContext } from '@/contexts/Alerts.context';
import { useLinesContext } from '@/contexts/Lines.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Routes } from '@/utils/routes';
import { DateTime } from 'luxon';
import { createContext, useContext, useEffect, useState } from 'react';

interface StopsDetailContextState {
	actions: {
		resetActiveTripId: () => void
		setActiveStopId: (stopId: string) => void
		setActiveTripId: (tripId: string, stopSequence: number) => void
	}
	data: {
		active_alerts: SimplifiedAlert[] | undefined
		active_pattern_group: Pattern | undefined
		active_shape: Shape | undefined
		active_stop_id: string
		active_stop_sequence: number | undefined
		active_trip_id: string | undefined
		lines: Line[] | undefined
		patterns: Pattern[][] | undefined
		stop: Stop | undefined
		timetable_realtime: Arrival[] | undefined
		timetable_realtime_future: Arrival[] | undefined
		timetable_realtime_past: Arrival[] | undefined
		timetable_schedule: Arrival[] | undefined
		valid_pattern_groups: Pattern[] | undefined
	}
	filters: {
		none: string | undefined
	}
	flags: {
		is_favorite: boolean
		is_loading: boolean
		is_loading_timetable: boolean
	}
}

const StopsDetailContext = createContext<StopsDetailContextState | undefined>(undefined);

export function useStopsDetailContext() {
	const context = useContext(StopsDetailContext);
	if (!context) {
		throw new Error('useStopsDetailContext must be used within a StopsDetailContextProvider');
	}
	return context;
}

export const StopsDetailContextProvider = ({ children, stopId }: { children: React.ReactNode, stopId?: string }) => {
	const stopsContext = useStopsContext();
	const linesContext = useLinesContext();
	const alertsContext = useAlertsContext();
	const profileContext = useProfileContext();
	const operationalDayContext = useOperationalDayContext();
	const [dataStopState, setDataStopState] = useState<Stop | undefined>(undefined);
	const [dataActiveStopIdState, setDataActiveStopIdState] = useState<string>(stopId || '');
	const [dataLinesState, setDataLinesState] = useState<Line[] | undefined>(undefined);
	const [dataPatternsState, setDataPatternsState] = useState<Pattern[][] | undefined>(undefined);
	const [dataValidPatternsState, setDataValidPatternsState] = useState<Pattern[] | undefined>(undefined);
	const [dataShapeState, setDataShapeState] = useState<Shape | undefined>(undefined);
	const [dataTimetableRealtimeState, setDataTimetableRealtimeState] = useState<Arrival[] | undefined>(undefined);
	const [dataTimetableRealtimePastState, setDataTimetableRealtimePastState] = useState<Arrival[] | undefined>(undefined);
	const [dataTimetableRealtimeFutureState, setDataTimetableRealtimeFutureState] = useState<Arrival[] | undefined>(undefined);
	const [dataTimetableScheduleState, setDataTimetableScheduleState] = useState<Arrival[] | undefined>(undefined);
	const [dataActivePatternState, setDataActivePatternState] = useState<Pattern | undefined>(undefined);
	const [dataActiveAlertsState, setDataActiveAlertsState] = useState<SimplifiedAlert[] | undefined>(undefined);
	const [dataActiveTripIdState, setDataActiveTripIdState] = useState<string | undefined>(undefined);
	const [dataActiveStopSequenceState, setDataActiveStopSequenceState] = useState<number | undefined>(undefined);
	const [flagIsFavoriteState, setFlagIsFavoriteState] = useState<boolean>(false);

	useEffect(() => {
		if (!dataActiveStopIdState || !stopsContext.data.stops || !stopsContext.data.stops.length) return;
		const foundStopData = stopsContext.actions.getStopById(dataActiveStopIdState);
		setDataStopState(foundStopData);
	}, [stopsContext.data.stops, dataActiveStopIdState]);

	useEffect(() => {
		if (!dataStopState) return;
		const linesData = dataStopState.line_ids.map(lineId => linesContext.actions.getLineDataById(lineId)).filter(lineData => lineData !== undefined);
		setDataLinesState(linesData);
	}, [dataStopState]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!dataActiveStopIdState) return;
				const realtimeData = await fetch(`${Routes.API}/arrivals/by_stop/${dataActiveStopIdState}`).then((response) => {
					if (!response.ok) console.log(`Failed to fetch realtime data for stopId: ${dataActiveStopIdState}`);
					else return response.json();
				});
				setDataTimetableRealtimeState(realtimeData);
			}
			catch (error) {
				console.error('Error fetching realtime data:', error);
				setDataTimetableRealtimeState([]);
			}
		};
		fetchData();
		const interval = setInterval(fetchData, 10000);
		return () => clearInterval(interval);
	}, [dataActiveStopIdState]);

	useEffect(() => {
		if (!dataStopState) return;
		(async () => {
			try {
				const patternsData = await Promise.all(dataStopState.pattern_ids.map((patternId) => {
					return fetch(`${Routes.API}/patterns/${patternId}`).then((response) => {
						if (!response.ok) console.log(`Failed to fetch pattern data for patternId: ${patternId}`);
						else return response.json();
					});
				}));
				setDataPatternsState(patternsData);
			}
			catch (error) {
				console.error('Error fetching all pattern data:', error);
			}
		})();
	}, [dataStopState]);

	useEffect(() => {
		if (!dataActivePatternState) return;
		(async () => {
			try {
				const shapeData = await fetch(`${Routes.API}/shapes/${dataActivePatternState.shape_id}`).then((response) => {
					if (!response.ok) console.log(`Failed to fetch shape data for shapeId: ${dataActivePatternState.shape_id}`);
					else return response.json();
				});
				if (shapeData) {
					shapeData.geojson = {
						...shapeData.geojson,
						properties: {
							color: dataActivePatternState.color,
							text_color: dataActivePatternState.text_color,
						},
					};
				}
				setDataShapeState(shapeData);
			}
			catch (error) {
				console.error('Error fetching shape data:', error);
			}
		})();
	}, [dataActivePatternState]);

	useEffect(() => {
		setFlagIsFavoriteState(profileContext.data.favorite_stops?.includes(stopId) ? true : false);
	}, [profileContext.data.favorite_stops, stopId]);

	useEffect(() => {
		const prepareTimetableRealtimeData = () => {
			if (!dataTimetableRealtimeState) return;
			const nowInUnixSeconds = DateTime.now().toSeconds();
			const timetableRealtimePastResult = dataTimetableRealtimeState
				.filter((arrival) => {
					if (arrival.observed_arrival_unix) return true;
					return (arrival.estimated_arrival_unix || arrival.scheduled_arrival_unix) < nowInUnixSeconds;
				})
				.filter((arrival) => {
					const lastStopSequence = dataValidPatternsState
						?.find(patternGroup => patternGroup.id === arrival.pattern_id)?.path
						.sort((a, b) => a.stop_sequence - b.stop_sequence)
						.slice(-1)[0]?.stop_sequence;
					return arrival.stop_sequence !== lastStopSequence;
				})
				.sort((a, b) => {
					const minimumArrivalA = a.observed_arrival_unix || a.scheduled_arrival_unix;
					const minimumArrivalB = b.observed_arrival_unix || b.scheduled_arrival_unix;
					return minimumArrivalA - minimumArrivalB;
				});
			const timetableRealtimeFutureResult = dataTimetableRealtimeState
				.filter((arrival) => {
					if (arrival.observed_arrival_unix) return false;
					return (arrival.estimated_arrival_unix || arrival.scheduled_arrival_unix) >= nowInUnixSeconds;
				})
				.filter((arrival) => {
					const lastStopSequence = dataValidPatternsState
						?.find(patternGroup => patternGroup.id === arrival.pattern_id)?.path
						.sort((a, b) => a.stop_sequence - b.stop_sequence)
						.slice(-1)[0]?.stop_sequence;
					return arrival.stop_sequence !== lastStopSequence;
				})
				.sort((a, b) => {
					const minimumArrivalA = a.estimated_arrival_unix || a.scheduled_arrival_unix;
					const minimumArrivalB = b.estimated_arrival_unix || b.scheduled_arrival_unix;
					return minimumArrivalA - minimumArrivalB;
				});
			setDataTimetableRealtimePastState(timetableRealtimePastResult || []);
			setDataTimetableRealtimeFutureState(timetableRealtimeFutureResult || []);
		};
		prepareTimetableRealtimeData();
		const interval = setInterval(prepareTimetableRealtimeData, 1000);
		return () => clearInterval(interval);
	}, [dataTimetableRealtimeState]);

	useEffect(() => {
		if (!operationalDayContext.data.selected_day || !dataValidPatternsState) return;
		const validScheduledTrips: Arrival[] = [];
		for (const patternGroup of dataValidPatternsState || []) {
			const lastStopSequence = patternGroup.path
				.sort((a, b) => a.stop_sequence - b.stop_sequence)
				.slice(-1)[0]?.stop_sequence;
			for (const trip of patternGroup.trips) {
				if (!trip.valid_on.includes(operationalDayContext.data.selected_day)) continue;
				for (const stopTime of trip.schedule) {
					if (stopTime.stop_id !== dataActiveStopIdState) continue;
					if (stopTime.stop_sequence === lastStopSequence) continue;
					const [arrivalHours, arrivalMinutes, arrivalSeconds] = stopTime.arrival_time.split(':').map(Number);
					const arrivalUnixTimestamp = DateTime
						.fromFormat(operationalDayContext.data.selected_day, 'yyyyMMdd')
						.set({ hour: 0, minute: 0, second: 0 })
						.plus({ hours: arrivalHours, minute: arrivalMinutes, second: arrivalSeconds })
						.toUnixInteger();
					validScheduledTrips.push({
						estimated_arrival: null,
						estimated_arrival_unix: null,
						headsign: patternGroup.headsign,
						line_id: patternGroup.line_id,
						observed_arrival: null,
						observed_arrival_unix: null,
						pattern_id: patternGroup.id,
						route_id: patternGroup.route_id,
						scheduled_arrival: stopTime.arrival_time_24h,
						scheduled_arrival_unix: arrivalUnixTimestamp,
						stop_sequence: stopTime.stop_sequence,
						trip_id: trip.trip_ids.length ? trip.trip_ids[0] : '',
						vehicle_id: null,
					});
				}
			}
		}
		validScheduledTrips.sort((a, b) => (a.scheduled_arrival_unix - b.scheduled_arrival_unix));
		setDataTimetableScheduleState(validScheduledTrips);
	}, [operationalDayContext.data.selected_day, dataValidPatternsState, dataActiveStopIdState]);

	useEffect(() => {
		if (!dataPatternsState || !operationalDayContext.data.selected_day) return;
		const activePatterns: Pattern[] = [];
		for (const pattern of dataPatternsState) {
			for (const patternGroup of pattern) {
				if (patternGroup.valid_on.includes(operationalDayContext.data.selected_day)) {
					activePatterns.push(patternGroup);
				}
			}
		}
		setDataValidPatternsState(activePatterns);
	}, [dataPatternsState, operationalDayContext.data.selected_day]);

	useEffect(() => {
		if (!alertsContext.data.simplified) return;
		const activeAlerts = alertsContext.data.simplified.filter((simplifiedAlertData) => {
			return simplifiedAlertData.informed_entity.some((informedEntity) => {
				if (!informedEntity.stop_id && !informedEntity.route_id) return false;
				const hasMatchingStop = informedEntity.stop_id === dataActiveStopIdState;
				const hasMatchingRoute = dataStopState?.route_ids.includes(informedEntity.route_id || '');
				const isActive = simplifiedAlertData.end_date ? simplifiedAlertData.end_date >= new Date() : true;
				return (hasMatchingStop || hasMatchingRoute) && isActive;
			});
		});
		setDataActiveAlertsState(activeAlerts);
	}, [alertsContext.data.simplified, dataStopState, dataActiveStopIdState]);

	const setActiveStopId = (stopId: string) => {
		resetActiveTripId();
		setDataActiveStopIdState(stopId);
	};

	const setActiveTripId = (tripId: string, stopSequence: number) => {
		const activePattern = dataValidPatternsState?.find(patternGroup => patternGroup.trips.find(trip => trip.trip_ids.includes(tripId)));
		if (activePattern) {
			setDataActivePatternState(activePattern);
		}
		setDataActiveTripIdState(tripId);
		setDataActiveStopSequenceState(stopSequence);
	};

	const resetActiveTripId = () => {
		setDataActivePatternState(undefined);
		setDataActiveTripIdState(undefined);
		setDataShapeState(undefined);
		setDataActiveStopSequenceState(undefined);
	};

	const contextValue: StopsDetailContextState = {
		actions: {
			resetActiveTripId,
			setActiveStopId,
			setActiveTripId,
		},
		data: {
			active_alerts: dataActiveAlertsState,
			active_pattern_group: dataActivePatternState,
			active_shape: dataShapeState,
			active_stop_id: dataActiveStopIdState,
			active_stop_sequence: dataActiveStopSequenceState,
			active_trip_id: dataActiveTripIdState,
			lines: dataLinesState,
			patterns: dataPatternsState,
			stop: dataStopState,
			timetable_realtime: dataTimetableRealtimeState,
			timetable_realtime_future: dataTimetableRealtimeFutureState,
			timetable_realtime_past: dataTimetableRealtimePastState,
			timetable_schedule: dataTimetableScheduleState,
			valid_pattern_groups: dataValidPatternsState,
		},
		filters: {
			none: undefined,
		},
		flags: {
			is_favorite: flagIsFavoriteState,
			is_loading: dataPatternsState === undefined,
			is_loading_timetable: dataPatternsState === undefined || dataTimetableRealtimeState === undefined,
		},
	};

	return (
		<StopsDetailContext.Provider value={contextValue}>
			{children}
		</StopsDetailContext.Provider>
	);
};
