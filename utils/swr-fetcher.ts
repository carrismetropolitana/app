/* * */

import { HttpException } from '@/core-replica';

import { HttpResponse } from './fetchData';

/* * */

interface SWRFetcherParams {
	accountId: string
	url: string
}

/**
 * Fetcher function for SWR to make authenticated requests.
 * @param params An object containing the URL and the account ID for the request.
 * @returns The data from the HTTP response.
 */
export const swrFetcher = async <T>({ accountId, url }: SWRFetcherParams): Promise<T> => {
	// Ensure account ID is provided
	if (!accountId) throw new Error('No account ID provided for authenticated request');
	// Make the fetch request with the Authorization header
	const response = await fetch(url, { headers: { Authorization: `Bearer ${accountId}` } });
	// Parse the JSON response
	const responseData = await response.json() as HttpResponse<T>;
	// Handle non-OK responses
	if (!response.ok) throw new HttpException(responseData.statusCode, responseData.error || 'Unknown error from server.');
	// Handle missing data
	if (!responseData.data) throw new HttpException(500, 'No data received from the server');
	// Return the data
	return responseData.data;
};
