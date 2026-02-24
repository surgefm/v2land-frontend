// #region Global Imports
import 'isomorphic-unfetch';
import { stringify } from 'query-string';
// #endregion Global Imports

// #region Interface Imports
import { HttpModel } from '@Interfaces';
// #endregion Interface Imports

const BaseUrl = typeof window === 'undefined'
  ? (process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL)
  : process.env.NEXT_PUBLIC_API_URL;
const cookies = {
  cookie: '',
};

export const imageUploadEndpoint = `${BaseUrl}/upload`;

export const Http = {
  Request: async <A>(
    methodType: string,
    url: string,
    params?: HttpModel.IRequestQueryPayload,
    payload?: HttpModel.IRequestPayload
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify(params)}` : '';

      fetch(encodeURI(`${BaseUrl}${url}${query}`), {
        body: JSON.stringify(payload),
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          ...cookies,
          'content-type': 'application/json',
        },
        method: `${methodType}`,
      })
        .then(async response => {
          if (Math.floor(response.status / 100) === 2) {
            return response.json().then(resolve);
          }
          return reject(response);
        })
        .catch(reject);
    });
  },
};

export const clearCookies = () => {
  cookies.cookie = '';
};

export const setCookies = (cookie: string) => {
  cookies.cookie = cookie;
};

export const get = async <A>(
  url: string,
  params?: HttpModel.IRequestQueryPayload,
  payload?: HttpModel.IRequestPayload
): Promise<A> => {
  return Http.Request('GET', url, params, payload);
};

export const post = async <A>(
  url: string,
  payload?: HttpModel.IRequestPayload,
  params?: HttpModel.IRequestQueryPayload
): Promise<A> => {
  return Http.Request('POST', url, params, payload);
};

export const put = async <A>(
  url: string,
  payload?: HttpModel.IRequestPayload,
  params?: HttpModel.IRequestQueryPayload
): Promise<A> => {
  return Http.Request('PUT', url, params, payload);
};

export const del = async <A>(
  url: string,
  params?: HttpModel.IRequestQueryPayload,
  payload?: HttpModel.IRequestPayload
): Promise<A> => {
  return Http.Request('DELETE', url, payload, params);
};
