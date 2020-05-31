import Router from 'next/router';
import { ReduxNextPageContext } from '@Interfaces';
import { UrlObject } from 'url';

type RedirectOptions = {
  permanent?: boolean;
  replace?: boolean;
  shallow?: boolean;
  hiddenQuery?: { [index: string]: string | number };
};

export const getQuery = (asPath: string | UrlObject, options: RedirectOptions = {}) => {
  const as = typeof asPath === 'string' ? asPath : (asPath.pathname as string);
  let query = as.indexOf('?') >= 0 ? as.slice(as.indexOf('?')) : '';
  if (options.hiddenQuery) {
    if (query.length === 0) query += '?';
    const { hiddenQuery } = options;
    if (query.length > 1) query += '&';
    const keys = Object.keys(hiddenQuery);
    query += keys.map(key => `${key}=${hiddenQuery[key] || 0}`).join('&');
  }

  return query;
};

export const getUrlFromAsPath = (asPath: string | UrlObject, options: RedirectOptions = {}) => {
  const as = typeof asPath === 'string' ? asPath : (asPath.pathname as string);
  const index = as.indexOf('?');
  const pathname = index >= 0 ? as.slice(0, index) : as;
  const query = getQuery(as, options);

  if (/^\/@[^/]+$/.test(pathname)) return `/[username]${query}`;
  if (/^\/@[^/]+\/[^/]+$/.test(pathname)) return `/[username]/[eventName]${query}`;
  if (/^\/@[^/]+\/[^/]+\/newsroom$/.test(pathname))
    return `/[username]/[eventName]/newsroom${query}`;
  if (/^\/@[^/]+\/[^/]+\/[\d]+$/.test(pathname)) return `/[username]/[eventName]/[stackId]${query}`;
  if (/^\/@[^/]+\/[^/]+\/[\d]+\/[\d]$/.test(pathname))
    return `/[username]/[eventName]/[stackId]/[newsId]${query}`;

  return `${pathname}${query}`;
};

function serverSideRedirect(
  ctx: ReduxNextPageContext,
  asPath: string | UrlObject,
  options: RedirectOptions = {}
) {
  const path = typeof asPath === 'object' ? (asPath.pathname as string) : asPath;
  const { res } = ctx as ReduxNextPageContext;
  if (!res) return;

  const index = path.indexOf('?');
  const query = getQuery(path, options);
  res.writeHead(options.permanent ? 301 : 302, {
    Location: encodeURI(index >= 0 ? `${path.slice(0, index)}${query}` : `${path}${query}`),
  });
  res.end();
}

function clientSideRedirect(asPath: string | UrlObject, options: RedirectOptions = {}) {
  if (typeof window === 'undefined') return;
  const path =
    typeof asPath === 'object' ? (((asPath as any).asPath || asPath.pathname) as string) : asPath;
  if (options.replace) {
    Router.replace(getUrlFromAsPath(path, options), path, { shallow: options.shallow });
  } else {
    Router.push(getUrlFromAsPath(path, options), path, { shallow: options.shallow });
  }
}

export function redirect(asPath: string | UrlObject, options?: RedirectOptions): void;
export function redirect(
  ctx: ReduxNextPageContext,
  asPath: string | UrlObject,
  options?: RedirectOptions
): void;

export function redirect(
  ctx: ReduxNextPageContext | string | UrlObject,
  asPath?: string | UrlObject | RedirectOptions,
  options?: RedirectOptions
) {
  if (typeof ctx === 'string' || !(ctx as ReduxNextPageContext).store) {
    clientSideRedirect(ctx as (string | UrlObject), asPath as RedirectOptions);
  } else if (typeof window === 'undefined') {
    serverSideRedirect(ctx as ReduxNextPageContext, asPath as (string | UrlObject), options);
  } else {
    clientSideRedirect(asPath as (string | UrlObject), options);
  }
}

export function replace(
  ctx: ReduxNextPageContext | string | UrlObject,
  asPath?: string | UrlObject | RedirectOptions,
  options?: RedirectOptions
) {
  redirect(ctx as ReduxNextPageContext, asPath as string, { ...options, replace: true });
}
