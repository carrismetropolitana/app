/* * */

import { DateTime } from 'luxon';
import { z } from 'zod';

/**
 * UnixTimestamp, in this context, is a number that represents
 * the number of milliseconds since the Unix epoch (1970-01-01T00:00:00Z).
 */
export type UnixTimestamp = number & {
	__brand: 'UnixTimestamp'
};

export const unixTimeStampSchema = z
	.number()
	.transform(validateUnixTimestamp);

/**
 * This function validates if a number is a valid Unix Timestamp, in milliseconds.
 * It is assumed the number will always be greater than 10^10 (1e10) to ensure it is in milliseconds.
 * Throws an error if the date is invalid.
 * @param milliseconds - The number to be validated.
 * @returns The given number as a UnixTimestamp.
 */
export function validateUnixTimestamp(milliseconds: number): UnixTimestamp {
	if (milliseconds < 1e10) throw new Error(`Invalid value '${milliseconds}', expected a number in milliseconds but received a number smaller than 1e10`);
	const parsedDate = DateTime.fromMillis(milliseconds);
	if (!parsedDate.isValid) throw new Error(`Invalid date '${milliseconds}, explanation: ${parsedDate.invalidExplanation}`);
	return parsedDate.toMillis() as UnixTimestamp;
}
