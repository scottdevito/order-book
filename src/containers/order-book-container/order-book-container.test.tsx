import React from "react";
import { render, screen, act } from "@testing-library/react";
import OrderBookContainer from "./order-book-container";
import { OrderBookStoreProvider } from "../../contexts/use-order-book-store/use-order-book-store";

describe("Order Book Container", () => {
  test("Order Book Container renders", () => {
    act(() => {
      render(
        <OrderBookStoreProvider>
          <OrderBookContainer />
        </OrderBookStoreProvider>
      );
    });
  });
});
