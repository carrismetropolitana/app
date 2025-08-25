/* * */

import { Dates } from '@/utils/dates/dates';
import { type OperationalDate, type UnixTimestamp } from '@tmlmobilidade/types';

/* * */

/**
 * Returns an array of individual dates from a given range of operational dates.
 * @param start The start date of the range, in OperationalDate format.
 * @param end The end date of the range, in OperationalDate format.
 * @returns An array of OperationalDate objects representing each date in the range.
 */
export function getOperationalDatesFromRange(start: OperationalDate, end: OperationalDate): OperationalDate[] {
	//

	//
	// Validate the start and end dates

	if (end < start) {
		throw new Error(`End date "${end}" must be after start date "${start}"`);
	}

	//
	// Parse the start and end dates to ensure they are in the correct format

	const startDate = Dates.fromOperationalDate(start, 'Europe/Lisbon');
	const endDate = Dates.fromOperationalDate(end, 'Europe/Lisbon');

	//
	// Create an array to hold the individual dates and iterate
	// from the start date to the end date, adding each date to the array

	const dates: OperationalDate[] = [];

	let current = startDate;

	while (current.operational_date <= endDate.operational_date) {
		dates.push(current.operational_date);
		current = current.plus({ days: 1 });
	}

	return dates;
}

/**
 * Sorts an array of objects by a Unix timestamp key in ascending or descending order.
 * The key must be of type UnixTimestamp, which is a number representing the timestamp in milliseconds.
 * @param data The array of objects to be sorted.
 * @param key The key of the objects to sort by, which must be a UnixTimestamp.
 * @param direction The direction to sort the data, either 'asc' for ascending or 'desc' for descending. Defaults to 'asc'.
 * @returns A new array of objects sorted by the specified Unix timestamp key.
 */
export function sortByUnixTimestamp<T, K extends keyof T>(data: T[], key: K extends keyof T ? (T[K] extends UnixTimestamp ? K : never) : never, direction: 'asc' | 'desc' = 'asc'): T[] {
	//

	if (direction === 'desc') {
		return [...data].sort((a: T, b: T) => {
			return (b[key] as number) - (a[key] as number);
		});
	}

	//
	// If direction is 'asc'

	return [...data].sort((a: T, b: T) => {
		return (a[key] as number) - (b[key] as number);
	});

	//
}
