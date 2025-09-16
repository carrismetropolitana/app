/* * */

import { type HttpResponse } from './fetchData';

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
	const response = await fetch(url, { headers: { Authorization: `Bearer ${accountId}` } });
	const responseData = await response.json() as HttpResponse<T>;
	if (!response.ok) throw new Error(responseData.error || 'An error occurred while fetching data.');
	if (!responseData.data) throw new Error('No data found in the response.');
	return responseData.data;
};
