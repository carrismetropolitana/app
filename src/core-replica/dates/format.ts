export interface DatesFormat {
	day?: '2-digit' | 'numeric'
	hour?: '2-digit' | 'numeric'
	minute?: '2-digit' | 'numeric'
	month?: '2-digit' | 'long' | 'numeric' | 'short'
	second?: '2-digit' | 'numeric'
	timeZoneName?: 'long' | 'short'
	weekday?: 'long' | 'narrow' | 'short'
	year?: '2-digit' | 'numeric'
}

const l = 'long', n = 'numeric', s = 'short';
const DATE_SHORT = {
	day: n,
	month: n,
	year: n,
} as DatesFormat;

const DATE_MEDIUM = {
	day: n,
	month: s,
	year: n,
} as DatesFormat;

const DATE_FULL = {
	day: n,
	month: l,
} as DatesFormat;

const DATE_FULL_WITH_YEAR = {
	day: n,
	month: l,
	year: n,
} as DatesFormat;

const DATE_HUGE = {
	day: n,
	month: l,
	weekday: l,
	year: n,
} as DatesFormat;

const TIME_SIMPLE = {
	hour: n,
	minute: n,
} as DatesFormat;

const TIME_WITH_SECONDS = {
	hour: n,
	minute: n,
	second: n,
} as DatesFormat;

const DATETIME_SHORT = {
	day: n,
	hour: n,
	minute: n,
	month: n,
	year: n,
} as DatesFormat;

const DATETIME_SHORT_WITH_SECONDS = {
	day: n,
	hour: n,
	minute: n,
	month: n,
	second: n,
	year: n,
} as DatesFormat;

const DATETIME_MEDIUM = {
	day: n,
	hour: n,
	minute: n,
	month: s,
	year: n,
} as DatesFormat;

const DATETIME_MEDIUM_WITH_SECONDS = {
	day: n,
	hour: n,
	minute: n,
	month: s,
	second: n,
	year: n,
} as DatesFormat;

const DATETIME_FULL = {
	day: n,
	hour: n,
	minute: n,
	month: l,
	timeZoneName: s,
	year: n,
} as DatesFormat;

const DATETIME_FULL_WITH_SECONDS = {
	day: n,
	hour: n,
	minute: n,
	month: l,
	second: n,
	timeZoneName: s,
	year: n,
} as DatesFormat;

export const OPERATIONAL_DATE_FORMAT = 'yyyyMMdd';

export const Formats = {
	DATE_FULL,
	DATE_FULL_WITH_YEAR,
	DATE_HUGE,
	DATE_MEDIUM,
	DATE_SHORT,
	DATETIME_FULL,
	DATETIME_FULL_WITH_SECONDS,
	DATETIME_MEDIUM,
	DATETIME_MEDIUM_WITH_SECONDS,
	DATETIME_SHORT,
	DATETIME_SHORT_WITH_SECONDS,
	OPERATIONAL_DATE_FORMAT,
	TIME_SIMPLE,
	TIME_WITH_SECONDS,
};
