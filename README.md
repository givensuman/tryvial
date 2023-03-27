# `tryto`
### Value-packed alternative to try/catch hell

This is a utility library that simplifies the try/catch block and packs on functionality for handling asynchronous operations.

## Installation

You can install the package using npm:

```bash
npm install tryto
# or
yarn add tryto
# or 
pnpm i tryto
```
## Usage

`tryto` tries to simplify code by wrapping the provided function in a try/catch block. If an error is thrown, you can provide an optional fallback(s) or a handler to manage the error. If you enable the retry functionality, the package will attempt to retry the operation a specified number of times. It's also got timeout support, fallbacks, the works.

That's the gist of it, here's the implementation:

```js
import tryto from "tryto";

const do_something = async () => {
  // your asynchronous code here
};

const handle_an_error = async (error?: Error) => {
  // your error handling here
}

// Simple implementation
const result = await tryto(do_something, {
  onError: handle_an_error
})

// Kitchen sink
const result = await tryto(do_something, {
  retry: true,
  retries: 5,
  retryDelay: 100,
  jitter: 500,
  fallback: [...some_fallbacks],
  timeout: true,
  timeoutAfter: 9999,
  onTimeout: () => console.error("A timeout occured"),
  onRetry: retry => console.log(`Retrying... ${retry}/5`),
  onSuccess: result => console.log(`Success: ${result}`),
  onError: handle_an_error
})
```

## Parameters

`tryto` only has two parameters, the `fn` that it tries, and the `options` it applies:

|name|type|default|description|
|---|---|---|---|
|retry|`boolean`|`false`|Whether or not to retry `fn`|
|retries|`number`|`2`|Number of times to retry before moving to the catch block|
|retryDelay|`number`|`0`|Delay (ms) to be implemented between retries|
|jitter|`number`|`0`|Delay (ms) to be randomly added to retries to prevent network bottlenecking with batch requests. For example, a `jitter` of 500 will add an additional delay anywhere between 0ms and 500ms.|
|fallback|`(() => Promise<T>) \| Array<() => Promise<T>>`|`undefined`|Fallback function or array of fallback functions to attempt if `fn` fails. Does not attempt retries. If an array is passed and all fallbacks fail, `onError` is passed an array of errors (`Error[]`).|
|timeout|`boolean`|`false`|Whether or not to enforce a timeout, after which `fn` automatically fails|
|timeoutAfter|`number`|`10000`|Time (ms) after which `fn` will automatically fail|
|onTimeout|`() => void`|`undefined`|Callback to run if timeout happens|
|onRetry|`(retryNumber: number) => void`|`undefined`|Callback to run if retry happens. Passes the current retry number as argument.|
|onSuccess|`(result: T) => void`|`undefined`|Callback to run if `fn` or `fallback` succeeds. Passes `result as T` as argument.|
|onError|`(error: Error \| Error[]) => void`|`undefined`|Callback to run if `fn` or `fallback` fails. Passes `error as Error` or `error as Error[]` as argument.|

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)