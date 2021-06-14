import { AvailableGroupings } from "./machines";

// App-wide
export const responsiveSizes = {
  mobileScreen: "725px",
};

// Crypto Facilities feed constants
export const bookUi1FeedConsts = {
  name: "book_ui_1",
  snapshot: "book_ui_1_snapshot",
  events: {
    subscribe: "subscribe",
    unsubscribe: "unsubscribe",
  },
  productIds: {
    xbtusd: "PI_XBTUSD",
    ethusd: "PI_ETHUSD",
  },
};

// Order Book
export const columnNames = ["Price", "Size", "Total"];
export const groupingOptions: {
  [index: string]:
    | Array<AvailableGroupings["ETHUSD"]>
    | Array<AvailableGroupings["XBTUSD"]>;
} = {
  [bookUi1FeedConsts.productIds.xbtusd]: [0.5, 1, 2.5],
  [bookUi1FeedConsts.productIds.ethusd]: [0.05, 0.1, 0.25],
};
