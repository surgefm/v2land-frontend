// #region Global Imports
import 'isomorphic-unfetch';
import getConfig from 'next/config';
import { stringify } from 'query-string';
// #endregion Global Imports

// #region Interface Imports
import { HttpModel } from '@Interfaces';
// #endregion Interface Imports

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

const BaseUrl = `${API_URL}`;

export const Http = {
  Request: async <A>(
    methodType: string,
    url: string,
    params?: HttpModel.IRequestQueryPayload,
    payload?: HttpModel.IRequestPayload
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify(params)}` : '';

      fetch(`${BaseUrl}${url}${query}`, {
        body: JSON.stringify(payload),
        cache: 'no-cache',
        headers: {
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
        .catch(e => {
          reject(e);
        });
    });
  },
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
  return Http.Request('POST', url, payload, params);
};

export const put = async <A>(
  url: string,
  payload?: HttpModel.IRequestPayload,
  params?: HttpModel.IRequestQueryPayload
): Promise<A> => {
  return Http.Request('PUT', url, payload, params);
};

export const del = async <A>(
  url: string,
  params?: HttpModel.IRequestQueryPayload,
  payload?: HttpModel.IRequestPayload
): Promise<A> => {
  return Http.Request('DELETE', url, payload, params);
};
