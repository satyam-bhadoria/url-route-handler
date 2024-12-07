import { match as pathToRegexpMatch } from 'path-to-regexp';
import { UrlOptions } from './types/url.type';

const TRAILING_SLASH_REGEXP = /\/+$/
const MATCHING_GROUP_REGEXP = /\((?:\?<(.*?)>)?(?!\?)/g

export class RouteLayer {
  handle: (...args: any) => any;
  keys: any;
  name: any;
  params: any;
  path: any;
  slash: any;
  matchers: any;

  constructor(path: string | RegExp, options: Record<string, any>, callback: (obj: UrlOptions, ...args: any) => any) {
    this.handle = callback;
    this.keys = [];
    this.name = callback.name || '<anonymous>';
    this.slash = path === '/' && options?.end === false;
    this.matchers = matcher(options)(path);
  }

  match (path: string | RegExp) {
    let match: any;
    if (path != null) {
      if (this.slash) {
        this.params = {};
        this.path = '';
        return true;
      }
      this.matchers && (match = this.matchers(path));
    }

    if (!match) {
      this.params = undefined
      this.path = undefined
      return false
    }
    this.params = match.params
    this.path = match.path
    this.keys = Object.keys(match.params)
    return true
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

function matcher (opts: Record<string, any>) {
  return (_path: string | RegExp) => {
    if (_path instanceof RegExp) {
      const keys : { name: string | number; offset: number }[] = [];
      let name = 0;
      let m;
      // eslint-disable-next-line no-cond-assign
      while (m = MATCHING_GROUP_REGEXP.exec(_path.source)) {
        keys.push({
          name: m[1] || name++,
          offset: m.index
        })
      }

      return function regexpMatcher (p: any) {
        const match = _path.exec(p)
        if (!match) {
          return false
        }

        const params: any = {}
        for (let i = 1; i < match.length; i++) {
          const key = keys[i - 1]
          const prop = key.name
          const val = decodeParam(match[i])

          if (val !== undefined) {
            params[prop] = val
          }
        }

        return {
          params,
          path: match[0]
        }
      }
    }

    return pathToRegexpMatch((opts.strict ? _path : loosen(_path)), {
      sensitive: opts.sensitive,
      end: opts.end,
      trailing: !opts.strict,
      decode: decodeParam
    })
  }
}

function decodeParam (val: any) {
  if (typeof val !== 'string' || val.length === 0) {
    return val
  }

  try {
    return decodeURIComponent(val)
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      (err as any).status = 400;
    }
    throw err
  }
}

function loosen (path: any): any {
  if (path instanceof RegExp || path === '/') {
    return path
  }

  return Array.isArray(path)
    ? path.map(function (p) { return loosen(p) })
    : String(path).replace(TRAILING_SLASH_REGEXP, '')
}