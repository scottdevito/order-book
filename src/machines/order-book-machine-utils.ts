import produce from "immer";
import {
  OrderBookRowsData,
  OrderData,
} from "../components/order-book/order-book/order-book-types";
import { bookUi1FeedConsts, groupingOptions } from "../consts";
import { twoDimArrSort } from "../utils";
import { AvailableGroupings } from "./order-book-machine-types";

// Slice functions to maintain slice rule consistency for different order types
// For asks we want the bottom most orders, for bids we want the top
export const asksIngressSlice = (asksToSlice: OrderBookRowsData) => {
  return asksToSlice.slice(-40);
};

export const bidsIngressSlice = (bidsToSlice: OrderBookRowsData) => {
  return bidsToSlice.slice(0, 40);
};

// Remove zeros and sort/store bids and asks in descending order
export const removeZeroPricesAndSortOrders = (
  ordersArray: OrderBookRowsData
) => {
  return ordersArray
    .filter((updatedOrder) => {
      return updatedOrder[1] !== 0;
    })
    .sort(twoDimArrSort);
};

export const groupByActiveGrouping = (
  ordersData: OrderBookRowsData,
  activeGrouping: AvailableGroupings["XBTUSD"] | AvailableGroupings["ETHUSD"]
) => {
  // Skip for the defaults because they're already grouped
  if (
    activeGrouping ===
      groupingOptions[bookUi1FeedConsts.productIds.xbtusd][0] ||
    activeGrouping === groupingOptions[bookUi1FeedConsts.productIds.ethusd][0]
  ) {
    return ordersData;
  }

  function roundToNearest(numberToRound: number, multipleToRoundTo: number) {
    const half = multipleToRoundTo / 2;
    return numberToRound + half - ((numberToRound + half) % multipleToRoundTo);
  }

  return ordersData.reduce(
    (acc: OrderBookRowsData, currentOrder: OrderData, idx: number) => {
      // Store the first order in the acc as starting point
      if (idx === 0) {
        const firstOrderPrice = roundToNearest(currentOrder[0], activeGrouping);

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
        const roundedCurrentOrderPrice = roundToNearest(
          currentOrder[0],
          activeGrouping
        );

        return (acc = [...acc, [roundedCurrentOrderPrice, currentOrder[1]]]);
      }
    },
    []
  );
};
