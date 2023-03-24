type Options<T> = {
    retry?: boolean,
    retries?: number,
    onRetry?: () => void,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
}

const tryto = async <T, K = T>(
    fn: () => Promise<T>,
    fallbackFn?: () => Promise<K>,
    options?: Options<T | K>
): Promise<T | K | undefined> => {
    const {
        retry = false,
        retries = 2,
        onRetry,
        onSuccess,
        onError
    } = options || {}

    let retriesLeft = retries

    while (true) {
        try {
            const result = await fn()

            if (onSuccess) {
                onSuccess(result)
            }

            return result
        } catch (error) {
            if (retry && retriesLeft > 0) {
                retriesLeft--

                if (onRetry) {
                    onRetry()
                }

                continue
            }

            if (fallbackFn) {
                try {
                    const result = await fallbackFn()

                    if (onSuccess) {
                        onSuccess(result)
                    }

                    return result
                } catch (fallbackError) {
                    if (onError) {
                        onError(fallbackError)
                    } else {
                        console.error(`Fallback error occured: ${fallbackError}`)
                    }

                    return undefined
                }   
            } else {
                if (onError) {
                    onError(error)
                } else {
                    console.error(`Error occured: ${error}`)
                }

                return undefined
            }
        }
    }
}

tryto.sync = <T, K = T>(
    fn: () => T,
    fallbackFn?: () => K,
    options?: Options<T | K>
): T | K | undefined => {
    const {
        retry = false,
        retries = 2,
        onRetry,
        onSuccess,
        onError
    } = options || {}

    let retriesLeft = retries

    while (true) {
        try {
            const result = fn()

            if (onSuccess) {
                onSuccess(result)
            }

            return result
        } catch (error) {
            if (retry && retriesLeft > 0) {
                retriesLeft--

                if (onRetry) {
                    onRetry()
                }

                continue
            }

            if (fallbackFn) {
                try {
                    const result = fallbackFn()

                    if (onSuccess) {
                        onSuccess(result)
                    }

                    return result
                } catch (fallbackError) {
                    if (onError) {
                        onError(fallbackError)
                    } else {
                        console.error(`Fallback error occured: ${fallbackError}`)
                    }

                    return undefined
                }   
            } else {
                if (onError) {
                    onError(error)
                } else {
                    console.error(`Error occured: ${error}`)
                }

                return undefined
            }
        }
    }
}

export default tryto