import { wait } from "../wait";

describe("wait", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should resolve after the specified number of milliseconds", async () => {
    const callback = jest.fn();

    const promise = wait(1000).then(callback);

    // Should not have called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(999);
    await Promise.resolve(); // Flush promises
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await Promise.resolve(); // Flush promises
    expect(callback).toHaveBeenCalledTimes(1);

    await promise;
  });

  it("should work with different time values", async () => {
    const callback = jest.fn();

    wait(500).then(callback);

    jest.advanceTimersByTime(500);
    await Promise.resolve();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should return a promise that resolves to void", async () => {
    const promise = wait(100);

    jest.advanceTimersByTime(100);
    const result = await promise;

    expect(result).toBeUndefined();
  });

  it("should support multiple concurrent waits", async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    wait(100).then(callback1);
    wait(200).then(callback2);

    // First callback resolves
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    // Second callback resolves
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
