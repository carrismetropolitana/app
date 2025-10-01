/**
 * Allowed app Environment values.
 * This type is used to define the environments in which the application can run.
 * It is used to differentiate between development, production, and staging environments.
 * It has a companion function `getCurrentEnvironment` that retrieves the current environment
 * based on the set environment variable.
 */
export type Environment = 'development' | 'production' | 'staging';

/**
 * Get the current environment from server-side `ENVIRONMENT`
 * or client-side `NEXT_PUBLIC_ENVIRONMET` variables.
 * @returns The current environment value.
 */
export function getCurrentEnvironment(): Environment {
	// Prefer server-side environment variable
	if (process.env.ENVIRONMENT) return process.env.ENVIRONMENT as Environment;
	// Fallback to client-side environment variable
	if (process.env.NEXT_PUBLIC_ENVIRONMENT) return process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
	// Fallback to development
	return 'development' as Environment;
}
