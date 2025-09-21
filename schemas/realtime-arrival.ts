/* * */

export interface Arrival {
	estimated_arrival: null | string
	estimated_arrival_unix: null | number
	headsign: string
	line_id: string
	observed_arrival: null | string
	observed_arrival_unix: null | number
	pattern_id: string
	route_id: string
	scheduled_arrival: string
	scheduled_arrival_unix: number
	status?: ArrivalStatus
	stop_sequence: number
	trip_id: string
	vehicle_id: null | string
};

export type ArrivalStatus = 'canceled' | 'observed' | 'realtime' | 'scheduled';
