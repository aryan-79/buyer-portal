import { env } from '../env';
import type { QueryContext } from './query-context';

const TOKEN_INVALID_MESSAGE = 'Invalid or expired token';

const isServer = typeof window === 'undefined';

const baseUrl = isServer ? env.API_URL : env.VITE_API_URL;

export type ErrorWrapper<TError> = TError | Error;

export type QueryFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
} & QueryContext['fetcherOptions'];

export async function queryFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {},
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal,
}: QueryFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> {
  let error: TError;
  try {
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    /**
     * As the fetch API is being used, when multipart/form-data is specified
     * the Content-Type header must be deleted so that the browser can set
     * the correct boundary.
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
     */
    if (requestHeaders['Content-Type']?.toLowerCase().includes('multipart/form-data')) {
      delete requestHeaders['Content-Type'];
    }

    const response = await fetch(`${baseUrl}${resolveUrl(url, queryParams, pathParams)}`, {
      signal,
      method: method.toUpperCase(),
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      headers: requestHeaders,
    });
    if (!response.ok) {
      try {
        const payload = await response.json();
        error = {
          status: response.status,
          payload,
        } as TError;
      } catch (e) {
        error = {
          status: 500,
          payload: {
            success: false,
            message: e instanceof Error ? `Unexpected error (${e.message})` : 'Unexpected error',
          },
        } as TError;
      }
    } else if (response.headers.get('content-type')?.includes('json')) {
      return await response.json();
    } else {
      // if it is not a json response, assume it is a blob and cast it to TData
      return (await response.blob()) as unknown as TData;
    }
  } catch (e) {
    const errorObject: Error = {
      name: 'unknown' as const,
      message: e instanceof Error ? `Network error (${e.message})` : 'Network error',
      stack: e as string,
    };

    throw errorObject;
  }

  if (error) {
    const e = error as any;
    if (!url.startsWith('/auth')) {
      if (e.status) {
        if (e.status === 403 && e.message === TOKEN_INVALID_MESSAGE) {
          const refreshUrl = new URL('/auth/refresh', baseUrl);
          await fetch(refreshUrl.href, {
            signal,
            method: 'GET',
            credentials: 'include',
          });
        }
      }
    }
  }

  throw error;
}

const resolveUrl = (url: string, queryParams: Record<string, string> = {}, pathParams: Record<string, string> = {}) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)] ?? '') + query;
};
