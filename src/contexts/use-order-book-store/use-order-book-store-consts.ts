export enum OrderBookStoreAction {
  HydrateOrderBookState = "hydrate_order_book_state",
}

export enum AvailableProductIds {
  XBTUSD = "PI_XBTUSD",
  ETHUSD = "PI_ETHUSD",
}

export type AvailableGroupings = {
  XBTUSD: 0.5 | 1 | 2.5;
  ETHUSD: 0.05 | 0.1 | 0.25;
};
