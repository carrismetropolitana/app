/* * */

export interface WidgetStop {
	pattern_ids: string[]
	stopId: string
	type: 'stops'
}

export interface WidgetLine {
	pattern_id: string[]
	type: 'lines'
}

export interface WidgetSmartNotification {
	end_time: number
	pattern_id: string
	radius: number
	start_time: number
	stop_id: string
	type: 'smart_notifications'
	week_days: ('friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday')[]
}

export interface WidgetSettings {
	display_order: number
	is_open: boolean
}

export interface Widget {
	data: WidgetLine | WidgetSmartNotification | WidgetStop
	id: string
	label: null | string
	settings: WidgetSettings
}
