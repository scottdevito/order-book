import { assign, Machine } from "xstate";
import { OrderBookRowsData } from "./components/order-book/order-book/order-book-types";

export enum ORDER_BOOK {
  "DISCONNECTED" = "disconnected",
  "IDLE" = "idle",
  "LOADING" = "loading",
  "ERROR" = "error",
}

export enum ORDER_BOOK_EVENT {
  "OPEN_CONNECTION" = "OPEN_CONNECTION",
  "HYDRATE" = "HYDRATE",
  "DISCONNECT" = "DISCONNECT",
  "ERROR" = "ERROR",
  "FETCH" = "FETCH",
  "UPDATE_ORDERS" = "UPDATE_ORDERS",
  "KILL" = "KILL",
  "TOGGLE" = "TOGGLE",
  "GROUP" = "GROUP",
  "RESOLVE" = "RESOLVE",
  "REJECT" = "REJECT",
}

export enum AvailableProductIds {
  XBTUSD = "PI_XBTUSD",
  ETHUSD = "PI_ETHUSD",
}

export type AvailableGroupings = {
  XBTUSD: 0.5 | 1 | 2.5;
  ETHUSD: 0.05 | 0.1 | 0.25;
};

export type MachineContext = {
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
  activeGrouping: AvailableGroupings["XBTUSD"] | AvailableGroupings["ETHUSD"];
  activeProductId: AvailableProductIds.XBTUSD | AvailableProductIds.ETHUSD;
  hasError: boolean;
  isLoading: boolean;
};

export interface OrderBookStateSchema {
  states: {
    disconnected: {};
    loading: {};
    idle: {};
    error: {};
  };
}

type IHydrateEvent = {
  type: ORDER_BOOK_EVENT.HYDRATE;
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
};

type IUpdateOrdersEvent = {
  type: ORDER_BOOK_EVENT.UPDATE_ORDERS;
  asks?: OrderBookRowsData;
  bids?: OrderBookRowsData;
};

export type OrderBookEvent =
  | { type: ORDER_BOOK_EVENT.OPEN_CONNECTION }
  | IHydrateEvent
  | { type: ORDER_BOOK_EVENT.DISCONNECT }
  | { type: ORDER_BOOK_EVENT.ERROR }
  | { type: ORDER_BOOK_EVENT.FETCH }
  | IUpdateOrdersEvent
  | { type: ORDER_BOOK_EVENT.KILL }
  | { type: ORDER_BOOK_EVENT.TOGGLE }
  | { type: ORDER_BOOK_EVENT.GROUP }
  | { type: ORDER_BOOK_EVENT.RESOLVE }
  | { type: ORDER_BOOK_EVENT.REJECT };

export const orderBookMachine = Machine<
  MachineContext,
  OrderBookStateSchema,
  OrderBookEvent
>({
  id: "orderBook",
  initial: ORDER_BOOK.DISCONNECTED,
  context: {
    asks: [],
    bids: [],
    activeGrouping: 0.5,
    activeProductId: AvailableProductIds.XBTUSD,
    hasError: false,
    isLoading: false,
  },
  states: {
    [ORDER_BOOK.DISCONNECTED]: {
      on: {
        OPEN_CONNECTION: ORDER_BOOK.LOADING,
      },
    },
    [ORDER_BOOK.IDLE]: {
      on: {
        DISCONNECT: ORDER_BOOK.DISCONNECTED,
        FETCH: ORDER_BOOK.LOADING,
        KILL: ORDER_BOOK.ERROR,
        TOGGLE: ORDER_BOOK.LOADING,
        GROUP: ORDER_BOOK.LOADING,
        UPDATE_ORDERS: {
          actions: assign({
            asks: (context, event: IUpdateOrdersEvent) => {
              // return event.asks && event.asks.length > 0
              //   ? Array.from(new Set([...context.asks, ...event.asks]))
              //   : context.asks;
              return event.asks
                ? [...context.asks, ...event.asks]
                    .filter((order) => order[1] > 0)
                    .slice(-15)
                : context.asks;
            },
            bids: (context, event: IUpdateOrdersEvent) => {
              // If the asks event [] is not empty
              if (event.bids) {
                // Return an array that's a mix of the old asks and new asks
                //  If the same price comes in, replace the old one (new Set, what order does it replace?)
                const newBidsArr = [...context.bids, ...event.bids]
                  //  Filter out prices of Size 0
                  .filter((order) => order[1] > 0);

                // and only take the top  15 of bids (Buys)

                return newBidsArr.length > 15
                  ? [...newBidsArr].slice(-15)
                  : newBidsArr;
              }
              return context.bids;
            },
          }),
        },
      },
    },
    [ORDER_BOOK.LOADING]: {
      on: {
        DISCONNECT: ORDER_BOOK.DISCONNECTED,
        RESOLVE: ORDER_BOOK.IDLE,
        HYDRATE: {
          target: ORDER_BOOK.IDLE,
          actions: assign({
            asks: (_, event: IHydrateEvent) => {
              console.log(event.asks);
              return event.asks.slice(-15);
            },
            bids: (_, event: IHydrateEvent) => {
              console.log(event.bids);
              return event.bids.slice(15);
            },
          }),
        },
        REJECT: ORDER_BOOK.ERROR,
      },
    },
    [ORDER_BOOK.ERROR]: {
      on: {
        FETCH: ORDER_BOOK.LOADING,
      },
    },
  },
});
