import { assign, Machine } from "xstate";
import { OrderBookRowsData } from "./components/order-book/order-book/order-book-types";
import {
  AvailableGroupings,
  AvailableProductIds,
} from "./contexts/use-order-book-store/use-order-book-store-consts";

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
  "KILL" = "KILL",
  "TOGGLE" = "TOGGLE",
  "GROUP" = "GROUP",
  "RESOLVE" = "RESOLVE",
  "REJECT" = "REJECT",
}

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

export type OrderBookEvent =
  | { type: ORDER_BOOK_EVENT.OPEN_CONNECTION }
  | IHydrateEvent
  | { type: ORDER_BOOK_EVENT.DISCONNECT }
  | { type: ORDER_BOOK_EVENT.ERROR }
  | { type: ORDER_BOOK_EVENT.FETCH }
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
      },
    },
    [ORDER_BOOK.LOADING]: {
      on: {
        DISCONNECT: ORDER_BOOK.DISCONNECTED,
        RESOLVE: ORDER_BOOK.IDLE,
        HYDRATE: {
          target: ORDER_BOOK.IDLE,
          actions: assign({
            asks: (_, event: IHydrateEvent) => event.asks,
            bids: (_, event: IHydrateEvent) => event.bids,
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
