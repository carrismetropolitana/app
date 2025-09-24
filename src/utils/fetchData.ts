export class HttpResponse<T> {
	public readonly data: null | T;
	public readonly error: null | string;
	public readonly isOk?: () => boolean;
	public readonly statusCode: number;

	constructor(
		{ data, error, statusCode }: { data: null | T, error: null | string, statusCode: number },
	) {
		this.data = data;
		this.error = error;
		this.statusCode = statusCode;

		this.isOk = () => statusCode >= 200 && statusCode < 300;
	}
}

/**
 * Fetches data from a URL with configurable HTTP method, body, headers, and options.
 * @param url - The URL to fetch from
 * @param method - The HTTP method to use (DELETE, GET, POST, PUT). Defaults to GET.
 * @param body - Optional request body data
 * @param headers - Optional request headers
 * @param options - Optional fetch options (excluding body, headers, method)
 * @returns Promise resolving to HttpResponse containing data, error and status
 * @example
 * ```ts
 * // GET request
 * const response = await fetchData<User>('/api/users/123');
 *
 * // POST request with body
 * const response = await fetchData<User>(
 *   '/api/users',
 *   'POST',
 *   { name: 'John', email: 'john@example.com' }
 * );
 * ```
 */
export async function fetchData<T>(
	url: string,
	method: 'DELETE' | 'GET' | 'POST' | 'PUT' = 'GET',
	body?: unknown,
	headers: Record<string, string> = {},
	options: Omit<RequestInit, 'body' | 'headers' | 'method'> = {},
): Promise<HttpResponse<T>> {
	try {
		const response = await fetch(url, {
			body: body ? JSON.stringify(body) : undefined,
			credentials: 'include',
			headers: {
				...(method === 'GET' || method === 'DELETE' || 'Content-Type' in headers ? {} : { 'Content-Type': 'application/json' }),
				...headers,
			},
			method,
			...options,
		});

		const data = await response.json() as HttpResponse<T>;

		if (!response.ok || data.error) {
			return new HttpResponse<T>({
				data: null,
				error: data.error,
				statusCode: response.status,
			});
		}

		return new HttpResponse<T>({
			data: data.data,
			error: null,
			statusCode: response.status,
		});
	}
	catch (error) {
		return new HttpResponse<T>({
			data: null,
			error: error instanceof Error ? error.message : 'Network error',
			statusCode: 500,
		});
	}
}
