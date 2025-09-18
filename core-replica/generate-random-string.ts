/* * */

import { generateRandomNumber } from '@/core-replica/generate-random-number';

/* * */

interface GenerateRandomStringProps {
	length?: number
	type?: 'alphabetic' | 'alphanumeric' | 'numeric'
}

/**
 * Creates a random string of a given length and type.
 * @param length The length of the string to generate. Defaults to `6`.
 * @param type The type of characters to include in the string. Defaults to `alphanumeric`.
 * @returns A random string of the specified length.
 */
export function generateRandomString({ length = 6, type = 'alphanumeric' }: GenerateRandomStringProps = {}): string {
	//

	const numericSet = '0123456789';
	const alphabeticSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const alphanumericSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	let allowedCharacters: string;

	switch (type) {
		case 'alphabetic':
			allowedCharacters = alphabeticSet;
			break;
		case 'numeric':
			allowedCharacters = numericSet;
			break;
		default:
			allowedCharacters = alphanumericSet;
			break;
	}

	let result = '';

	for (let i = 0; i < length; i++) {
		result += allowedCharacters.charAt(Math.floor(generateRandomNumber() * allowedCharacters.length));
	}

	return result;

	//
}
