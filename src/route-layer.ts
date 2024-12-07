import { pathToRegexp } from 'path-to-regexp';
import { UrlOptions } from './types/url.type';

export class RouteLayer {
  handle: (...args: any) => any;
  name: any;
  params: any;
  path: any;
  regexp: RegExp;
  keys: any;

  constructor(path: string, options: Record<string, any>, callback: (obj: UrlOptions, ...args: any) => any) {
    options = options || {};
    this.handle = callback;
    this.name = callback.name || '<anonymous>';
    const { regexp, keys } = pathToRegexp(path, options);
    this.regexp = regexp;
    this.keys = keys;
  }

  match (path: string) {
    let match: any;
    if (path != null) {
      if (path === '/') {
        this.params = {};
        this.path = '';
        return true;
      }

      if (path === '/*') {
        this.params = { '0': decodeParam(path) }
        this.path = path;
        return true;
      }
      match = this.regexp.exec(path);
    }

    if (!match) {
      this.params = undefined;
      this.path = undefined;
      return false;
    }

    // store values
    this.params = {};
    this.path = match[0];

    // iterate matches
    var keys = this.keys;
    var params = this.params;

    for (var i = 1; i < match.length; i++) {
      var key = keys[i - 1];
      var prop = key.name;
      var val = decodeParam(match[i]);

      if (val !== undefined || !(Object.hasOwnProperty.call(params, prop))) {
        params[prop] = val;
      }
    }
    return true;
  }

  handleError (err: any) {
    return {
      status: 'error',
      message: err.message,
    };
  }

  handleRequest (urlObj: UrlOptions, ...args: any) {
    try {
      return this.handle(urlObj, ...args);
    } catch (err: any) {
      return this.handleError(err);
    }
  }
}

function decodeParam (val: any) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      (err as any).status = 400;
    }
    throw err;
  }
}
