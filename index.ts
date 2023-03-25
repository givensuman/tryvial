type Options<T> = {
    retry?: boolean,
    retries?: number,
    onRetry?: (retry?: number) => void,
    onSuccess?: (result?: T) => void,
    onError?: (error?: Error) => void
}

const tryto = async <T, K = T>(
    fn: () => Promise<T>,
    catchFn?: () => Promise<K | never>,
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
                    onRetry(retries - retriesLeft)
                }

                continue
            }

            if (catchFn) {
                try {
                    const result = await catchFn()

                    return result
                } catch (catchError) {
                    if (onError) {
                        onError(catchError)
                    } else {
                        console.error(`Fallback error occured: ${catchError}`)
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
    catchFn?: () => K,
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
                    onRetry(retries - retriesLeft)
                }

                continue
            }

            if (catchFn) {
                try {
                    const result = catchFn()

                    return result
                } catch (catchError) {
                    if (onError) {
                        onError(catchError)
                    } else {
                        console.error(`Fallback error occured: ${catchError}`)
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