import { OrderData } from "./components/order-book/order-book/order-book-types";

// Util sorting function for 2d arrays
export const twoDimArrSort = function (a: OrderData, b: OrderData) {
  return a[0] - b[0];
};
