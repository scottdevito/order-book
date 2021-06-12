import React from "react";
import { render, screen } from "@testing-library/react";
import OrderBookContainer from "./order-book-container";

describe("Order Book Container", () => {
  test("Order Book Container renders", () => {
    render(<OrderBookContainer />);
  });
});
