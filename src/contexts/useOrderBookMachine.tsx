import React from "react";
import {
  OrderBookMachineSend,
  OrderBookMachineState,
} from "../components/order-book/order-book/order-book-types";

// Context to pass around machine functions

export const OrderBookMachineContext =
  React.createContext<
    { send: OrderBookMachineSend; state: OrderBookMachineState } | undefined
  >(undefined);

export function useOrderBookMachine() {
  const context = React.useContext(OrderBookMachineContext);
  if (context === undefined) {
    throw new Error(
      "useOrderBookMachine must be within OrderBookMachineContextProvider"
    );
  }

  return context;
}
