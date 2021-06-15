import { OrderBookRowsData } from "../components/order-book/order-book/order-book-types";

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

export type IHydrateEvent = {
  type: ORDER_BOOK_EVENT.HYDRATE;
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
};

export type IUpdateOrdersEvent = {
  type: ORDER_BOOK_EVENT.UPDATE_ORDERS;
  asks: OrderBookRowsData;
  bids: OrderBookRowsData;
};

export type IGroupEvent = {
  type: ORDER_BOOK_EVENT.GROUP;
  activeGrouping: AvailableGroupings["XBTUSD"] | AvailableGroupings["ETHUSD"];
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
  | IGroupEvent
  | { type: ORDER_BOOK_EVENT.RESOLVE }
  | { type: ORDER_BOOK_EVENT.REJECT };
