import { RouteLayer } from "./route-layer";
import { UrlOptions } from "./types/url.type";

function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export class Router {
  layers: RouteLayer[] = [];

  use(path: string, callback: (obj: UrlOptions, ...args: any) => any) {
    this.layers.push(new RouteLayer(path, {}, callback));
  }

  handle(url: string, ...args: any) {
    const urlObj = new URL(url, 'http://localhost');
    for (const layer of this.layers) {
      if (layer.match(urlObj.pathname)) {
        const queryParam: Record<string, string> = {};
        urlObj.searchParams?.forEach((value, key) => {
          queryParam[key] = value;
        });
        const result = layer.handleRequest({
          url: urlObj.href,
          host: urlObj.host,
          origin: urlObj.origin,
          pathname: urlObj.pathname,
          protocol: urlObj.protocol,
          query: queryParam,
          params: { ...layer.params },
          hash: urlObj.hash?.slice(1),
        }, ...args);
        if (isPromise(result)) {
          return result.then((res: any) => {
            return {
              status: 'success',
              data: res,
            };
          }).catch(layer.handleError);
        }
        return {
          status: 'success',
          data: result,
        };
      }
    }
    return {
      status: 'error',
      message: 'No route found',
    }
  }
}