import { render, cleanup } from "@testing-library/react";
import OrderBook from "./order-book";

afterEach(cleanup);

const sellSideRowData = [
  [2300, 47341.0],
  [500, 47340.5],
  [500, 47339.5],
  [105266, 47339.0],
  [12824, 47336.5],
  [15000, 47335.0],
  [45315, 47334.5],
  [51344, 47334.0],
  [3952, 47333.5],
  [50078, 47330.0],
  [18360, 47329.5],
  [75827, 47329.0],
  [4000, 47328.5],
  [44899, 47328.0],
  [10000, 47327.5],
];

const buySideRowData = [
  [2300, 47363.5],
  [4736, 47364.0],
  [6390, 47364.5],
  [8315, 47365.0],
  [4000, 47366.5],
  [5000, 47367.0],
  [50802, 47370.5],
  [2990, 47371.5],
  [18129, 47374.0],
  [32033, 47375.0],
  [37140, 47376.5],
  [61091, 47377.0],
  [13056, 47377.5],
  [17765, 47378.5],
  [15000, 47380.0],
];

const props = {
  sellSideRowData: sellSideRowData,
  buySideRowData: buySideRowData,
};

describe("Order Book", () => {
  test("Buy and Sell Total columns render correctly", () => {
    const { queryByText, rerender } = render(<OrderBook {...props} />);

    // Expect the final left side total to exist as shown in the mockup
    expect(queryByText("440165")).toBeTruthy();

    // Flip the data each side receives
    rerender(
      <OrderBook
        sellSideRowData={buySideRowData}
        buySideRowData={sellSideRowData}
      />
    );

    // Expect the final right side total to exist as shown in the mockup
    expect(queryByText("278747")).toBeTruthy();
  });

  test("Buy and Sell can render without data", () => {
    render(<OrderBook sellSideRowData={[]} buySideRowData={[]} />);
  });
});
