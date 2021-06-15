import React from "react";
import { OrderBookMachineSend } from "../components/order-book/order-book/order-book-types";

// Context to pass around machine send function

export const OrderBookMachineSendContext =
  React.createContext<OrderBookMachineSend | undefined>(undefined);

export function useOrderBookMachineSend() {
  const context = React.useContext(OrderBookMachineSendContext);
  if (context === undefined) {
    throw new Error(
      "useOrderBookMachineSend must be within OrderBookMachineSendContextProvider"
    );
  }

  return context;
}
