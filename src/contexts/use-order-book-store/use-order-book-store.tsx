import React, { FC } from "react";
import { OrderBookRowsData } from "../../components/order-book/order-book/order-book-types";
import { AvailableGroupings, AvailableProductIds } from "../../machines";

// Context to keep track of the levels to display in the Order Book
export enum OrderBookStoreAction {
  HydrateOrderBookState = "hydrate_order_book_state",
}

type State = {
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
  activeGrouping: AvailableGroupings["XBTUSD"] | AvailableGroupings["ETHUSD"];
  activeProductId: AvailableProductIds.XBTUSD | AvailableProductIds.ETHUSD;
  hasError: boolean;
  isLoading: boolean;
};

export type Action = {
  type: OrderBookStoreAction.HydrateOrderBookState;
  payload: {
    asks: OrderBookRowsData;
    bids: OrderBookRowsData;
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
      return {
        ...state,
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
    activeGrouping: 0.5,
    activeProductId: AvailableProductIds.XBTUSD,
    hasError: false,
    isLoading: false,
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
