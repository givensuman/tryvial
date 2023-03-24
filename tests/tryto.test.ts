import tryto from "../"

describe("tryto", () => {
    test("should return the result of the input function", async () => {
      const result = await tryto(async () => "Hello, world!");
  
      expect(result).toBe("Hello, world!");
    });
  
    test("should catch and handle errors", async () => {
      const onError = jest.fn();
      const fallbackFn = jest.fn(async () => "Fallback value");
      const result = await tryto(
        () => {
          throw new Error("Something went wrong");
        },
        fallbackFn,
        { onError }
      );
  
      expect(result).toBe("Fallback value");
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Something went wrong"));
      expect(fallbackFn).toHaveBeenCalledTimes(1);
    });
  
    test("should retry when retry is true and retries is greater than 0", async () => {
      let count = 0;
  
      const result = await tryto(
        async () => {
          if (count === 0) {
            count++;
            throw new Error("Something went wrong");
          }
          return "Hello, world!";
        },
        undefined,
        { retry: true, retries: 1, onRetry: () => count++ }
      );
  
      expect(result).toBe("Hello, world!");
      expect(count).toBe(1);
    });
  
    test("should not retry when retry is false", async () => {
      let count = 0;
  
      const result = await tryto(
        () => {
          count++;
          throw new Error("Something went wrong");
        },
        undefined,
        { retry: false }
      );
  
      expect(result).toBeUndefined();
      expect(count).toBe(1);
    });
  
    test("should fallback to fallbackFn when retry is false and there is a fallbackFn", async () => {
      const result = await tryto(() => {
        throw new Error("Something went wrong");
      }, async () => "Fallback value", { retry: false });
  
      expect(result).toBe("Fallback value");
    });
  
    test("should handle errors thrown in the fallbackFn", async () => {
      const onError = jest.fn();
      const fallbackFn = () => {
        throw new Error("Fallback error");
      };
      const result = await tryto(
        () => {
          throw new Error("Something went wrong");
        },
        fallbackFn,
        { onError }
      );
  
      expect(result).toBeUndefined();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Fallback error"));
    });
  
    test("should call onSuccess when the input function succeeds", async () => {
      const onSuccess = jest.fn();
      const result = await tryto(async () => "Hello, world!", undefined, { onSuccess });
  
      expect(result).toBe("Hello, world!");
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith("Hello, world!");
    });
  
    test("should call onError when an error occurs and there is no fallbackFn", async () => {
      const onError = jest.fn();
      const result = await tryto(() => {
        throw new Error("Something went wrong");
      }, undefined, { onError });
  
      expect(result).toBeUndefined();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error("Something went wrong"));
    });
  });