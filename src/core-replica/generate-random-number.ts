/* * */

import { getRandomValues } from 'expo-crypto';

/**
 * Generates a secure random number between 0 and 1.
 * This function uses the Web Crypto API so it is suitable
 * for cryptographic purposes.
 * @returns A random number between 0 and 1
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
export function generateRandomNumber(): number {
	const array = new Uint32Array(1);
	getRandomValues(array);
	return array[0] / 2 ** 32;
}
