/* * */

import crypto from 'expo-crypto';

/**
 * Generates a secure random token.
 * This function uses the Node.js crypto module to generate
 * a random token suitable for cryptographic purposes.
 * @returns A random token as a hexadecimal string.
 * @see https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
 */
export function generateRandomToken(): string {
	return crypto.getRandomBytes(32).toString();
}
