import produce from "immer";
import {
  OrderBookRowsData,
  OrderData,
} from "../components/order-book/order-book/order-book-types";
import { AvailableGroupings } from "./order-book-machine-types";

// Slice functions to maintain slice rule consistency for different order types
// For asks we want the bottom most orders, for bids we want the top
export const asksIngressSlice = (asksToSlice: OrderBookRowsData) => {
  return asksToSlice.slice(-40);
};

export const bidsIngressSlice = (bidsToSlice: OrderBookRowsData) => {
  return bidsToSlice.slice(0, 40);
};

export const groupByActiveGrouping = (
  ordersData: OrderBookRowsData,
  activeGrouping: AvailableGroupings["XBTUSD"] | AvailableGroupings["ETHUSD"]
) => {
  // Skip for the defaults because they're already grouped
  if (activeGrouping === 0.5 || activeGrouping === 0.05) {
    return ordersData;
  }

  return ordersData.reduce(
    (acc: OrderBookRowsData, currentOrder: OrderData, idx: number) => {
      const shouldBeRounded = activeGrouping % 1 === 0;

      // Store the first order in the acc as starting point
      if (idx === 0) {
        const firstOrderPrice = shouldBeRounded
          ? Math.floor(currentOrder[0])
          : currentOrder[0];

        return (acc = [...acc, [firstOrderPrice, currentOrder[1]]]);
      }

      const lastOrderInAcc = acc[acc.length - 1];
      // Find the delta between the current price and the last price in the acc
      const numberShouldBeMerged =
        Math.abs(lastOrderInAcc[0] - currentOrder[0]) <= activeGrouping;

      // If this new number minus the last number in the acc is less than the active grouping, add it's size to the size of the last number in the acc
      if (numberShouldBeMerged) {
        return (acc = produce(acc, (draft) => {
          const lastElement = draft.pop();

          lastElement &&
            draft.push([lastElement[0], lastElement[1] + currentOrder[1]]);
        }));
      } else {
        // If the delta is larger, add it to the acc and move on to the next number
        // Before adding the number, see if we should round down or not
        const roundedCurrentOrderPrice = shouldBeRounded
          ? Math.floor(currentOrder[0])
          : currentOrder[0];

        return (acc = [...acc, [roundedCurrentOrderPrice, currentOrder[1]]]);
      }
    },
    []
  );
};
