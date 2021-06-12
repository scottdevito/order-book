import React, { FC } from "react";
import { OrderBookRowData } from "../../types/order-book-types";
import { OrderBookStoreAction } from "./use-order-book-store-consts";

// Context to keep track of the levels to display in the Order Book

type State = {
  asks: OrderBookRowData;
  bids: OrderBookRowData;
};

export type Action = {
  type: OrderBookStoreAction.HydrateOrderBookState;
  payload: {
    asks: OrderBookRowData;
    bids: OrderBookRowData;
  };
};

type Dispatch = (action: Action) => void;

const OrderBookStoreContext = React.createContext<State | undefined>(undefined);
const OrderBookStoreDispatchContext =
  React.createContext<Dispatch | undefined>(undefined);

const OrderBookStoreReducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Initial hydration of Order Book
    case OrderBookStoreAction.HydrateOrderBookState:
      // TODO Sort by Price (sorted by Size by default from API)
      // const sortedAsks = action.payload.asks

      return {
        asks: action.payload.asks,
        bids: action.payload.bids,
      };
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};

export const OrderBookStoreProvider: FC<{}> = ({
  children,
}): React.ReactElement => {
  const orderBookStoreState: State = {
    asks: [],
    bids: [],
  };

  const [state, dispatch] = React.useReducer(
    OrderBookStoreReducer,
    orderBookStoreState
  );

  return (
    <OrderBookStoreContext.Provider value={state}>
      <OrderBookStoreDispatchContext.Provider value={dispatch}>
        {children}
      </OrderBookStoreDispatchContext.Provider>
    </OrderBookStoreContext.Provider>
  );
};

const useOrderBookStoreState = (): State => {
  const context = React.useContext(OrderBookStoreContext);
  if (context === undefined) {
    throw new Error(
      "useOrderBookStoreContext must be used within an Order Book Store provider"
    );
  }
  return context;
};

const useOrderBookStoreDispatch = (): Dispatch => {
  const context = React.useContext(OrderBookStoreDispatchContext);
  if (context === undefined) {
    throw new Error(
      "OrderBookStoreDispatchContext must be used within an Order Book Store provider"
    );
  }
  return context;
};

export const useOrderBookStore = (): { state: State; dispatch: Dispatch } => {
  return {
    state: useOrderBookStoreState(),
    dispatch: useOrderBookStoreDispatch(),
  };
};
