import React from "react";
import { render, act } from "@testing-library/react";
import App from "./App";
import { OrderBookStoreProvider } from "../../contexts/use-order-book-store/use-order-book-store";

describe("App", () => {
  test("App renders", () => {
    act(() => {
      render(
        <OrderBookStoreProvider>
          <App />
        </OrderBookStoreProvider>
      );
    });
  });
});
