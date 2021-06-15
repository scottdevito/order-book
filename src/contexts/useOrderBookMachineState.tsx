import React from "react";
import { OrderBookMachineState } from "../components/order-book/order-book/order-book-types";

// Context to pass around machine state function

export const OrderBookMachineStateContext =
  React.createContext<OrderBookMachineState | undefined>(undefined);

export function useOrderBookMachineState() {
  const context = React.useContext(OrderBookMachineStateContext);
  if (context === undefined) {
    throw new Error(
      "useOrderBookMachineState must be within OrderBookMachineStateContextProvider"
    );
  }

  return context;
}
