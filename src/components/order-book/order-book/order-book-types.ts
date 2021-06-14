/**
 * How much currency it costs per unit
 */
export type Price = number;
/**
 * How many units to be bought/sold
 */
export type Size = number;
/**
 * Running number of the sizes up until that level
 */
export type Total = number;

/**
 * Represents one order - an array of [Price, Size]
 */
export type OrderData = [Price, Size];

export type OrderBookRowsData = Array<OrderData>;

export interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invocation of the debounced function.
   */
  cancel(): void;

  /**
   * If there is a pending invocation of the debounced function, invoke it immediately and return
   * its return value.
   *
   * Otherwise, return the value from the last invocation, or undefined if the debounced function
   * was never invoked.
   */
  flush(): ReturnType<T> | undefined;
}
