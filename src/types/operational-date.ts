/* * */

import { DateTime } from 'luxon';
import { z } from 'zod';

/* * */

export const OPERATIONAL_DATE_FORMAT = 'yyyyMMdd';

export type OperationalDate = string & {
	__brand: 'OperationalDate'
};

export const operationalDateSchema = z
	.string()
	.transform(validateOperationalDate)
	.brand('OperationalDate');

/**
 * This function validates if a string is a valid operational date.
 * Throws an error if the date is invalid.
 * @param date - The date to be validated.
 * @returns The given string as an OperationalDate.
 */
export function validateOperationalDate(date: string): OperationalDate {
	const parsedDate = DateTime.fromFormat(date, OPERATIONAL_DATE_FORMAT);
	if (!parsedDate.isValid) throw new Error(`Invalid date format '${date}', expected format: ${OPERATIONAL_DATE_FORMAT}, explanation: ${parsedDate.invalidExplanation}`);
	return date as OperationalDate;
}
