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
