/* * */

import { type Environment, getCurrentEnvironment } from '@/core-replica';

/* * */

const SERVICE_URLS = Object.freeze({

	accounts: {
		development: 'https://accounts.carrismetropolitana.pt/v1',
		production: 'https://accounts.carrismetropolitana.pt/v1',
		staging: 'https://staging.accounts.carrismetropolitana.pt/v1',
	},

	api: {
		development: 'https://api.carrismetropolitana.pt',
		production: 'https://api.carrismetropolitana.pt',
		staging: 'https://api.carrismetropolitana.pt',
	},

	app_view: {
		development: 'https://carrismetropolitana.pt/app-view',
		production: 'https://carrismetropolitana.pt/app-view',
		staging: 'https://carrismetropolitana.pt/app-view',
	},

	assets: {
		development: 'https://storage.carrismetropolitana.pt/static/app/assets',
		production: 'https://storage.carrismetropolitana.pt/static/app/assets',
		staging: 'https://storage.carrismetropolitana.pt/static/app/assets',
	},

	backoffice: {
		development: 'https://carrismetropolitana.pt/admin',
		production: 'https://carrismetropolitana.pt/admin',
		staging: 'https://carrismetropolitana.pt/admin',
	},

	tap_and_ride: {
		development: 'https://tap-and-ride.carrismetropolitana.pt',
		production: 'https://tap-and-ride.carrismetropolitana.pt',
		staging: 'https://tap-and-ride.carrismetropolitana.pt',
	},

	tts: {
		development: 'https://storage.carrismetropolitana.pt/static',
		production: 'https://storage.carrismetropolitana.pt/static',
		staging: 'https://storage.carrismetropolitana.pt/static',
	},

	website: {
		development: 'https://carrismetropolitana.pt',
		production: 'https://carrismetropolitana.pt',
		staging: 'https://carrismetropolitana.pt',
	},

});

/**
 * Retrieves the value of a specific property from the app configuration for a given app and environment.
 * @param app The app ID.
 * @param property The property of the app configuration to retrieve (e.g., 'api_url', 'frontend_url').
 * @param environment The environment to get the property for. If not provided, it will use the ENVIRONMENT environment variable.
 * @returns The value of the specified property for the given app and environment.
 */
export function getServiceUrl(service: keyof typeof SERVICE_URLS, environment?: Environment): string {
	// Get the desired service object
	const serviceObject = SERVICE_URLS[service];
	if (!serviceObject) throw new Error(`[@core/lib] App Config Object for "${service}" app not found. Available services: ${Object.keys(SERVICE_URLS).join(', ')}`);
	// Extract the current service environment either from the parameter
	// or automatically from the set environment variable.
	const currentEnvironment = environment || getCurrentEnvironment();
	// Get the config group for the current environment
	const propertyValueForEnvironment = serviceObject[currentEnvironment];
	if (!propertyValueForEnvironment) throw new Error(`[@core/lib] AppConfig group for service "${service}" in environment "${currentEnvironment}" environment not found. Available environments: ${Object.keys(serviceObject).join(', ')}`);
	// Return the value
	return propertyValueForEnvironment;
}
