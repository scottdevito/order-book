import {
  assign,
  Assigner,
  DefaultContext,
  Event,
  EventObject,
  Machine,
  PropertyAssigner,
  PayloadSender,
} from "xstate";
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

interface OrderBookStateSchema {
  states: {
    disconnected: {};
    loading: {};
    idle: {};
    error: {};
  };
}

type IHydrateEvent = {
  type: "HYDRATE";
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
};

type OrderBookEvent =
  | { type: "OPEN_CONNECTION" }
  | IHydrateEvent
  | { type: "DISCONNECT" }
  | { type: "ERROR" }
  | { type: "FETCH" }
  | { type: "KILL" }
  | { type: "TOGGLE" }
  | { type: "GROUP" }
  | { type: "RESOLVE" }
  | { type: "REJECT" };

export const orderBookMachine = Machine<
  any,
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
    error: false,
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
