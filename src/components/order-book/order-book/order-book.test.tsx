import { render, cleanup } from "@testing-library/react";
import {
  mockSellSideRowsData,
  mockBuySideRowsData,
} from "../../../test-utils/mock-order-book-rows-data";
import OrderBook from "./order-book";
import { OrderBookMachineState } from "./order-book-types";

afterEach(cleanup);

const props = {
  sellSideRowsData: mockSellSideRowsData,
  buySideRowsData: mockBuySideRowsData,
  machineState: { matches: () => false } as unknown as OrderBookMachineState,
};

describe("Order Book", () => {
  test("Buy and Sell Total columns render correctly", () => {
    const { queryByText, rerender } = render(<OrderBook {...props} />);

    // Expect the final left side total to exist as shown in the mockup
    expect(queryByText("440,165")).toBeTruthy();

    // Re-render and expect the final right side total to exist as shown in the mockup
    rerender(<OrderBook {...props} />);

    // Expect the final right side total to exist as shown in the mockup
    expect(queryByText("278,747")).toBeTruthy();
  });

  test("Buy and Sell sides can render without data", () => {
    render(<OrderBook {...props} sellSideRowsData={[]} buySideRowsData={[]} />);
  });

  test("Buy and Sell sides can handle different data on re-render", () => {
    const { rerender } = render(<OrderBook {...props} />);

    // Re-render and expect the final right side total to exist as shown in the mockup
    rerender(
      <OrderBook
        {...props}
        sellSideRowsData={mockBuySideRowsData}
        buySideRowsData={mockSellSideRowsData}
      />
    );
  });

  test("Loading div renders when in the loading state", () => {
    const { queryByText } = render(
      <OrderBook {...props} machineState={{ matches: () => true }} />
    );

    expect(queryByText("Loading...")).toBeTruthy();
  });
});
