# tryto | Simplified try/catch API

A utility library that simplifies the try/catch block and provides optional retry functionality for (a)synchronous operations.

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

The package exports two functions: `tryto` and `tryto.sync`

These simplify code by wrapping the provided function in a try/catch block. If an error is thrown, you can provide an optional fallback function to handle the error. If you enable the retry functionality, the package will attempt to retry the operation a specified number of times. 

That's the gist of it, here's the implementation:

```js
import tryto from "tryto";

const do_something = async () => {
  // your asynchronous code here
};

const handle_an_error = async () => {
  // your asynchronous fallback here
}

tryto(do_something, handle_a_failure, {
  retry: true,
  retries: 3,
  onRetry: () => {
    console.log("Retrying...");
  },
  onSuccess: () => {
    console.log("Operation succeeded!");
  },
  onError: () => {
    console.log("Operation failed!");
  },
});
```

`tryto.sync` is a synchronous version of the above.

```js
import tryto from "tryto";

const do_something_synchronously = () => {
  // your synchronous code here
};

tryto.sync(do_something_synchronously)
```

## Parameters

`tryto` has three parameters:

|name|type|description|
|---|---|---|
|fn|() => Promise\<T>|The function to try and execute|
|catchFn|() => Promise<K \| never>|The function to try and execute if `fn` fails|
|options|Options\<T>|See below|

Both `tryto` and `tryto.sync` take an options object with the following properties:

|name|type|default|description|
|---|---|---|---|
|retry|boolean|false|Whether or not to retry `fn` before moving to `catchFn`|
|retries|number|2|Number of retries to attempt, if `retry` is true
|onRetry|() => void|undefined|Callback to run on retry attempt|
|onSuccess|() => void|undefined|Callback to run if `fn` succeeds|
|onError*|() => void|undefined|Callback to run if `fn` *and* `catchFn` fail|

*`onError` has default behavior of logging `Error occured: ${error}` or `Fallback error occured: ${catchError}`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)