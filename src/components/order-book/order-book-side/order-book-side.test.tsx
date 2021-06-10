import { render, cleanup, screen } from "@testing-library/react";
import OrderBookSide from "./order-book-side";
import { renderBookColumns, renderLevelRows } from "../order-book/order-book";

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

const sellSideColumnNames = ["Total", "Size", "Price"];
const buySideColumnNames = [...sellSideColumnNames].reverse();

const sellSideProps = {
  renderBookColumns: renderBookColumns,
  columnNames: sellSideColumnNames,
  renderLevelRows: renderLevelRows,
  rowData: sellSideRowData,
  isSellSide: true,
};

const buySideProps = {
  renderBookColumns: renderBookColumns,
  columnNames: buySideColumnNames,
  renderLevelRows: renderLevelRows,
  rowData: buySideRowData,
  isSellSide: false,
};

describe("Order Book Side", () => {
  test("Sell side renders the correct amount of levels", async () => {
    render(<OrderBookSide {...sellSideProps} />);

    const levels = await screen.findAllByText(/[0-9]/);

    // We should get one number per row for each column that exists * the number of rows
    expect(levels).toHaveLength(
      sellSideColumnNames.length * sellSideRowData.length
    );
  });

  test("Buy side renders the correct amount of levels", async () => {
    render(<OrderBookSide {...buySideProps} />);

    const levels = await screen.findAllByText(/[0-9]/);

    // We should get one number per row for each column that exists * the number of rows
    expect(levels).toHaveLength(
      sellSideColumnNames.length * sellSideRowData.length
    );
  });
});
