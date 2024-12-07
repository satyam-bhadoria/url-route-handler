# URL Handler

The library provides a flexible and efficient way to map URL patterns to their respective handler methods. By defining a set of URL patterns and the corresponding handler functions, this package allows seamless routing, ensuring that each url is processed by the correct function.

## Installation

### NPM
```bash
npm i url-route-handler
```

### PNPM
```bash
pnpm i url-route-handler
```

### YARN
```bash
yarn add url-route-handler
```

## Quick Start

### Import

```ts
import { Router } from 'url-route-handler';
```

### Usage

```ts
const router = new Router();
router.use('/foo/bar/:barId', (url: UrlOptions) => {
  return url.params.barId;
});

...
...

const response = router.handle('https://domain.xyz/foo/bar/12345');
console.log(response.data); // 12345
```
#### UrlOptions

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `url` | `string` | contains href part of url send in router.handle method |
| `host` | `any` | host of the url passed. localhost in case if not provided |
| `origin` | `string` | origin of url |
| `pathname` | `string` | url path excluding host, query params and hash |
| `protocol` | `string` | http or https or etc |
| `query` | `object` | json object containing query params. key: value pair |
| `params` | `object` | path parameters json object. key: value pair |
| `hash` | `string` | contains hash string present in url |

### Methods

The following are methods for `Router`

- [use(path, callbackHandler)](#usepath-string-url-urloptions--args-any--any-void)
- [handle(url [, ...args])](#handleurl-string--additionaldata-any----any-response)

#### use(path: string, (url: UrlOptions [, ...args: any]) => any): void
```ts
router.use('/foo/bar/:barId', (url, someMap) => {
    // someMap passed from handle method
    ...
});
```

#### handle(url: string [, additionalData: any [, ...]]) => any): Response
```ts
const someMap = new Map();
...
const res = router.handle('https://domain.xyz/foo/bar/:barId', someMap);
// someMap will be passed to handler method
```
Response
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `status` | `string` | `success`/`error` |
| `data` | `any` | in case of success, data is returned from handler method |
| `message` | `string` | in case of error, error message returned |


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Add your changes: `git add .`
4. Commit your changes: `git commit -m 'your commit message'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request 😎

### Development

#### Local Development

```bash
pnpm install
pnpm build
```

#### Test

```bash
pnpm test
```
