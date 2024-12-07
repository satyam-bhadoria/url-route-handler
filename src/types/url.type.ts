export type UrlOptions = {
  url: string;
  host: string;
  origin: string;
  pathname: string;
  protocol: string;
  query: Record<string, string>;
  params: Record<string, any>;
  hash: string;
}