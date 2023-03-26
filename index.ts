type Options<T> = {
    retry?: boolean;
    retries?: number;
    retryDelay?: number;
    jitter?: number;
    fallback?: (() => Promise<T>) | Array<() => Promise<T>>;
    timeout?: boolean;
    timeoutAfter?: number;
    onTimeout?: () => void;
    onRetry?: (retryNumber: number) => void;
    onSuccess?: (result: T) => void;
    onError?: (error: Error | Error[]) => void;
}

export async function tryto<T>(
fn: () => Promise<T>,
options?: Options<T>
): Promise<T | undefined> {
    const {
        retry = false,
        retries = 2,
        retryDelay = 0,
        jitter = 0,
        fallback,
        timeout = false,
        timeoutAfter = 10000,
        onTimeout,
        onRetry,
        onSuccess,
        onError,
    } = options || {};

    let retriesLeft = retries;

    while (true) {
        try {
            let result: T

            if (timeout) {
                result = await Promise.race([
                    fn(),
                    new Promise<T>((_, reject) => {
                        setTimeout(() => {
                            reject(new Error());

                            if (onTimeout) {
                                onTimeout();
                            }
                        }, timeoutAfter)
                    })
                ])
            } else {
                result = await fn();
            }

            if (onSuccess) {
                onSuccess(result as T);
            }

            return result as T;
        } catch (error) {
            retriesLeft--;

            if (retriesLeft >= 0 && retry) {
                if (onRetry) {
                    onRetry(retries - retriesLeft);
                }
     
                const waitTime = Math.max(retryDelay,(Math.floor(Math.random() * jitter) + retryDelay));

                await new Promise((resolve) => setTimeout(resolve, waitTime));

                continue;
            }

            if (onError) {
                onError(error as Error);
            }

            if (fallback) {
                if (Array.isArray(fallback)) {
                    const errorArray: Error[] = []

                    for (const fallbackFn of fallback) {
                        try {
                            const fallbackResult = await fallbackFn();

                            if (onSuccess) {
                                onSuccess(fallbackResult);
                            }

                            return fallbackResult;
                        } catch (fallbackError) {
                            errorArray.push(fallbackError as Error);
                        }
                    }

                    if (onError) {
                        onError(errorArray);
                    }
                } else {
                    try {
                        const fallbackResult = await fallback();

                        if (onSuccess) {
                            onSuccess(fallbackResult);
                        }

                        return fallbackResult;
                    } catch (fallbackError) {
                        if (onError) {
                            onError(fallbackError as Error)
                        }
                    }
                }
            }

            return undefined
        }
    }
}

export default tryto