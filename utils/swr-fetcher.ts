/* * */

import { HttpException } from '@/core-replica';
import { type HttpResponse } from '@/utils/fetchData';

/* * */

interface SWRFetcherParams {
	device_id: string
	url: string
}

/**
 * Fetcher function for SWR to make authenticated requests.
 * @param params An object containing the URL and the account ID for the request.
 * @returns The data from the HTTP response.
 */
export const swrFetcher = async <T>({ device_id, url }: SWRFetcherParams): Promise<T> => {
	// Ensure device ID is provided
	if (!device_id) throw new Error('No device ID provided for authenticated request');
	// Make the fetch request with the Authorization header
	const response = await fetch(url, { headers: { Authorization: `Bearer ${device_id}` } });
	// Parse the JSON response
	const responseData = await response.json() as HttpResponse<T>;
	// Handle non-OK responses
	if (!response.ok) throw new HttpException(responseData.statusCode, responseData.error || 'Unknown error from server.');
	// Handle missing data
	if (!responseData.data) throw new HttpException(500, 'No data received from the server');
	// Return the data
	return responseData.data;
};
