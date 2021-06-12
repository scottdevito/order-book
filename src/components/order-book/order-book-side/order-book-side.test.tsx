import { render, cleanup, screen } from "@testing-library/react";
import OrderBookSide from "./order-book-side";
import { renderBookColumns, renderLevelRows } from "../order-book/order-book";
import {
  mockSellSideRowsData,
  mockBuySideRowsData,
} from "../../../test-utils/mock-order-book-rows-data";

afterEach(cleanup);

const sellSideColumnNames = ["Total", "Size", "Price"];
const buySideColumnNames = [...sellSideColumnNames].reverse();

const sellSideProps = {
  renderBookColumns: renderBookColumns,
  columnNames: sellSideColumnNames,
  renderLevelRows: renderLevelRows,
  rowsData: mockSellSideRowsData,
  isSellSide: true,
  isMobileScreen: false,
};

const buySideProps = {
  renderBookColumns: renderBookColumns,
  columnNames: buySideColumnNames,
  renderLevelRows: renderLevelRows,
  rowsData: mockBuySideRowsData,
  isSellSide: false,
  isMobileScreen: false,
};

describe("Order Book Side", () => {
  test("Sell side renders the correct amount of levels", async () => {
    render(<OrderBookSide {...sellSideProps} />);

    const levels = await screen.findAllByText(/[0-9]/);

    // For every row, we should get one number for each column that exists * the number of rows
    expect(levels).toHaveLength(
      sellSideColumnNames.length * mockSellSideRowsData.length
    );
  });

  test("Buy side renders the correct amount of levels", async () => {
    render(<OrderBookSide {...buySideProps} />);

    const levels = await screen.findAllByText(/[0-9]/);

    // For every row, we should get one number for each column that exists * the number of rows
    expect(levels).toHaveLength(
      sellSideColumnNames.length * mockSellSideRowsData.length
    );
  });
});
