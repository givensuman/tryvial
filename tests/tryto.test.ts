import tryto from '../index';

// Mock function that always throws an error
const failingFn = async () => {
  throw new Error();
};

describe('tryto', () => {
  describe('without options', () => {
    it('should return the result of the function', async () => {
      const result = await tryto(() => Promise.resolve('foo'));

      expect(result).toEqual('foo');
    });

    it('should return undefined if the function throws an error', async () => {
      const result = await tryto(failingFn);

      expect(result).toBeUndefined();
    });
  });

  describe('with retry', () => {
    it('should retry the function and return the result', async () => {
      let count = 0;
      const result = await tryto(() => {
        count++;
        if (count === 3) {
          return Promise.resolve('foo');
        }
        throw new Error();
      }, { retry: true, retries: 3 });

      expect(result).toEqual('foo');
      expect(count).toEqual(3);
    });

    it('should not retry the function if retry is false', async () => {
      let count = 0;
      const result = await tryto(() => {
        count++;
        throw new Error();
      }, { retry: false });

      expect(result).toBeUndefined();
      expect(count).toEqual(1);
    });
  });

  describe('with fallback', () => {
    it('should try the fallback function and return the result if the main function fails', async () => {
      const result = await tryto(failingFn, { fallback: () => Promise.resolve('foo') });

      expect(result).toEqual('foo');
    });

    it('should try the fallback functions in order if the previous one fails', async () => {
      const result = await tryto(failingFn, {
        fallback: [
          () => Promise.reject(new Error()),
          () => Promise.reject(new Error()),
          () => Promise.resolve('foo'),
        ]
      });

      expect(result).toEqual('foo');
    });

    it('should return undefined if all fallback functions fail', async () => {
      const result = await tryto(failingFn, {
        fallback: [
          () => Promise.reject(new Error()),
          () => Promise.reject(new Error()),
          () => Promise.reject(new Error()),
        ]
      });

      expect(result).toBeUndefined();
    });
  });

  describe('with timeout', () => {
    it('should return the result of the function if it completes before the timeout', async () => {
      const result = await tryto(() => Promise.resolve('foo'), { timeout: true });

      expect(result).toEqual('foo');
    });

    it('should return undefined if the function takes longer than the timeout', async () => {
      const result = await tryto(() => new Promise(resolve => setTimeout(() => resolve('foo'), 5000)), { timeout: true, timeoutAfter: 1000 });

      expect(result).toBeUndefined();
    });

    it('should call onTimeout if the function times out', async () => {
      const onTimeout = jest.fn();
      await tryto(() => new Promise(resolve => setTimeout(() => resolve('foo'), 5000)), { timeout: true, timeoutAfter: 1000, onTimeout });

      expect(onTimeout).toHaveBeenCalled();
    });
  });
});

describe('tryto with options', () => {
  it('calls onError when all retries fail', async () => {
    const err = new Error('Something went wrong');
    const fn = jest.fn().mockRejectedValue(err);
    const onError = jest.fn();

    const result = await tryto(fn, {
      retry: true,
      retries: 2,
      retryDelay: 0,
      onError,
    });

    expect(fn).toHaveBeenCalledTimes(3);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(err);
    expect(result).toBeUndefined();
  });

  it('calls onSuccess when successful', async () => {
    const value = 42;
    const fn = jest.fn().mockResolvedValue(value);
    const onSuccess = jest.fn();

    const result = await tryto(fn, { onSuccess });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(value);
    expect(result).toBe(value);
  });

  it('calls onRetry for each retry', async () => {
    const err = new Error('Something went wrong');
    const fn = jest
      .fn()
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err)
      .mockResolvedValue(42);

    const onRetry = jest.fn();

    const result = await tryto(fn, {
      retry: true,
      retries: 2,
      retryDelay: 0,
      onRetry,
    });

    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(1);
    expect(onRetry).toHaveBeenCalledWith(2);
    expect(result).toBe(42);
  });
});

