/* * */

import { HttpResponse } from './fetchData';

/* * */

interface SWRFetcherParams {
	token: string
	url: string
}

/**
 * Fetcher function for SWR to make authenticated requests.
 * @param params An object containing the token and URL for the request.
 * @returns The data from the HTTP response.
 */
export const swrFetcher = async <T>({ token, url }: SWRFetcherParams): Promise<T> => {
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	const data = await res.json() as HttpResponse<T>;
	if (!res.ok) console.log(res.status, data.error ?? 'An error occurred');
	return data.data as T;
};
