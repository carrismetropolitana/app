import type { Feature } from "geojson";

export namespace ApiTypes {
	export interface Vehicle {
		agency_id?: string;
		bikes_allowed?: boolean;
		capacity_seated?: number;
		capacity_standing?: number;
		capacity_total?: number;
		id?: string;
		license_plate?: string;
		make?: string;
		model?: string;
		owner?: string;
		propulsion?: string;
		registration_date?: string;
		wheelchair_accessible?: boolean;
		bearing?: number;
		block_id?: string;
		current_status?: "INCOMING_AT" | "STOPPED_AT" | "IN_TRANSIT_TO";
		event_id?: string;
		lat?: number;
		line_id?: string;
		lon?: number;
		pattern_id?: string;
		route_id?: string;
		schedule_relationship?: "SCHEDULED" | "ADDED" | "UNSCHEDULED" | "CANCELED";
		shift_id?: string;
		speed?: number;
		stop_id?: string;
		timestamp?: number;
		trip_id?: string;
		door_status?: "OPEN" | "CLOSED";
	}

	export interface Stop {
		district_id?: string;
		facilities?: string[];
		id?: string;
		lat?: number;
		line_ids?: string[];
		locality_id?: string;
		lon?: number;
		long_name?: string;
		municipality_id?: string;
		operational_status?: "active" | "inactive";
		pattern_ids?: string[];
		region_id?: string;
		route_ids?: string[];
		short_name?: string;
		tts_name?: string;
		wheelchair_boarding?: boolean;
	}

	interface ShapePoint {
		shape_dist_traveled: number;
		shape_pt_lat: number;
		shape_pt_lon: number;
		shape_pt_sequence: number;
	}

	export interface Shape {
		extension: number;
		geojson: Feature;
		points: ShapePoint[];
		shape_id: string;
	}
}
