# tryto(do_a_thing)

A utility library that simplifies the try/catch block and provides optional retry functionality for asynchronous operations.
Installation

You can install the package using npm:

```bash
npm install tryto
# or
yarn add tryto
# or 
pnpm i tryto
```
Usage

The package exports two functions: `tryto` and `tryto.sync`

tryCatchAsync simplifies error handling for asynchronous operations by wrapping the provided function in a try/catch block. If an error is thrown, you can provide an optional fallback function to handle the error. If you enable the retry functionality, the package will attempt to retry the operation a specified number of times.

```js

import { tryCatchAsync } from "try-catch-async";

const asyncFunc = async () => {
  // your asynchronous code here
};

tryCatchAsync(asyncFunc, {
  fallback: (error) => {
    console.log(`An error occurred: ${error}`);
  },
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

tryCatchSync is a synchronous version of tryCatchAsync.

```js

import { tryCatchSync } from "try-catch-async";

const syncFunc = () => {
  // your synchronous code here
};

tryCatchSync(syncFunc, {
  fallback: (error) => {
    console.log(`An error occurred: ${error}`);
  },
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

Options

Both tryCatchAsync and tryCatchSync take an options object with the following properties:

    fallback (optional): A function to be called if an error occurs. The function receives the error as an argument.
    retry (optional): A boolean indicating whether to retry the operation if an error occurs. Defaults to false.
    retries (optional): The maximum number of times to retry the operation. Defaults to 3.
    onRetry (optional): A function to be called when a retry is attempted.
    onSuccess (optional): A function to be called if the operation succeeds.
    onError (optional): A function to be called if the operation fails and all retries have been exhausted.

Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
License

[MIT](https://choosealicense.com/licenses/mit/)