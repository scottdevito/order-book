import * as React from "react";
import styled from "styled-components";
import { colors } from "../../../styles/styles";
import { OrderBookRowsData, OrderData, Total } from "./order-book-types";
import OrderBookSide from "../order-book-side/order-book-side";
import sellDepthVisualizerBg from "../../../assets/images/sellDepthVisualizerBg.svg";
import buyDepthVisualizerBg from "../../../assets/images/buyDepthVisualizerBg.svg";
import { columnNames, responsiveSizes } from "../../../consts";
import { useMediaQuery } from "../../custom-hooks/use-media-query";
import { State } from "xstate";
import debounce from "lodash.debounce";
import { twoDimArrSort } from "../../../utils";
import { ORDER_BOOK } from "../../../machines/order-book-machine-types";

export interface OrderBookProps {
  sellSideRowsData: OrderBookRowsData;
  buySideRowsData: OrderBookRowsData;
  machineState:
    | State<{
        error: boolean;
        isLoading: boolean;
      }>
    | any;
}

/**
 * Util function to render OrderBook columns
 * @param columnNames
 * @returns An array of column header labels as elements
 */
export const renderBookColumns = (columnNames: Array<string>) => {
  return columnNames.map((columnName, idx) => {
    return <ColumnHeader key={idx}>{columnName}</ColumnHeader>;
  });
};

// Pre-calculate the final Total so we can use it in each row to create the depth visualizer
const finalTotal = (sortedRowsData: OrderBookRowsData) => {
  return sortedRowsData.length > 0
    ? sortedRowsData.reduce((total: Total, currentItem: OrderData) => {
        return (total = total + currentItem[1]);
      }, 0)
    : 0;
};

// Debounce const for renderRows
const debounceInterval = 500;

/**
 * Function to render Sell side Order Book level rows (split out from Buy side so they can be debounced independently)
 * @param rowsData Array of [size, price] that represents all of the data for the rows
 * @param isMobileScreen
 * @returns An array of rows as React elements
 */
export const renderSellSideLevelRows = debounce(
  (rowsData: OrderBookRowsData, isMobileScreen: boolean) => {
    // Display the bottom 15 of the Sell rows
    const maxNumberOfSellRowsToDisplayData = rowsData.slice(-15);

    /**
     *  Sort by price
     *    Sell side => always sort high-to-low
     *    Buy side => desktop sort low-to-high, mobile sort high-to-low
     */
    const sortedRowsData = [...maxNumberOfSellRowsToDisplayData].sort(
      twoDimArrSort
    );

    // Keep track of the total level as we make our way through the rows
    let runningTotal = 0;

    // Create row - calculate row Total and store vars for depth visualizer
    return sortedRowsData.map((rowItem, idx) => {
      // Get the new row Total based on the previous Total and the new Size
      const currentRowItemTotal = runningTotal + rowItem[1];

      // Calculate the depth percentage based off of this row's Total
      const currentRowItemDepthPercent =
        (currentRowItemTotal / finalTotal(sortedRowsData)) * 100;

      // Update the running total
      runningTotal = currentRowItemTotal;

      // Reorder rows considering which side we're rendering and what the size of the screen is
      return !isMobileScreen ? (
        <div
          key={idx}
          style={{
            width: "100%",
            background: `url(${sellDepthVisualizerBg})`,

            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            backgroundSize: `${currentRowItemDepthPercent}% 100%`,
          }}
        >
          <LevelRowContentWrapper>
            <LevelRowItem>
              {new Intl.NumberFormat().format(currentRowItemTotal)}
            </LevelRowItem>
            <LevelRowItem>
              {new Intl.NumberFormat().format(rowItem[1])}
            </LevelRowItem>
            <LevelRowPriceItem>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(rowItem[0])}
            </LevelRowPriceItem>
          </LevelRowContentWrapper>
        </div>
      ) : (
        <div
          key={idx}
          style={{
            width: "100%",
            background: `url(${sellDepthVisualizerBg})`,

            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",

            backgroundSize: `${currentRowItemDepthPercent}% 100%`,
          }}
        >
          <LevelRowContentWrapper>
            <LevelRowPriceItem>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(rowItem[0])}
            </LevelRowPriceItem>
            <LevelRowItem>
              {new Intl.NumberFormat().format(rowItem[1])}
            </LevelRowItem>
            <LevelRowItem>
              {new Intl.NumberFormat().format(currentRowItemTotal)}
            </LevelRowItem>
          </LevelRowContentWrapper>
        </div>
      );
    });
  },
  debounceInterval,
  { leading: true, maxWait: debounceInterval }
);

/**
 * Function to render Buy side Order Book level rows (split out from Sell side so they can be debounced independently)
 * @param rowsData Array of [size, price] that represents all of the data for the rows
 * @param isMobileScreen
 * @returns An array of rows as React elements
 */
export const renderBuySideLevelRows = debounce(
  (rowsData: OrderBookRowsData, isMobileScreen: boolean) => {
    // Display the top 15 of the Buy rows
    const maxNumberOfBuyRowsToDisplayData = rowsData.slice(0, 15);

    /**
     *  Sort by price
     *    Sell side => always sort high-to-low
     *    Buy side => desktop sort low-to-high, mobile sort high-to-low
     */
    const sortedRowsData = [...maxNumberOfBuyRowsToDisplayData]
      .sort(twoDimArrSort)
      .reverse();

    // Keep track of the total level as we make our way through the rows
    let runningTotal = 0;

    // Create row - calculate row Total and store vars for depth visualizer
    return sortedRowsData.map((rowItem, idx) => {
      // Get the new row Total based on the previous Total and the new Size
      const currentRowItemTotal = runningTotal + rowItem[1];

      // Calculate the depth percentage based off of this row's Total
      const currentRowItemDepthPercent =
        (currentRowItemTotal / finalTotal(sortedRowsData)) * 100;

      // Update the running total
      runningTotal = currentRowItemTotal;

      // Reorder rows considering which side we're rendering and what the size of the screen is
      return (
        <div
          key={idx}
          style={{
            width: "100%",
            background: `url(${buyDepthVisualizerBg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: isMobileScreen ? "right" : "left",
            backgroundSize: `${currentRowItemDepthPercent}% 100%`,
          }}
        >
          <LevelRowContentWrapper>
            <LevelRowPriceItem>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(rowItem[0])}
            </LevelRowPriceItem>
            <LevelRowItem>
              {new Intl.NumberFormat().format(rowItem[1])}
            </LevelRowItem>
            <LevelRowItem>
              {new Intl.NumberFormat().format(currentRowItemTotal)}
            </LevelRowItem>
          </LevelRowContentWrapper>
        </div>
      );
    });
  },
  debounceInterval,
  { leading: true, maxWait: debounceInterval }
);

const OrderBook: React.FC<OrderBookProps> = (props) => {
  let isMobileScreen = useMediaQuery(
    `(max-width: ${responsiveSizes.mobileScreen})`
  );

  // Reorder column header names based on screen layout for mobile
  const sellSideColumnNames = isMobileScreen
    ? columnNames
    : [...columnNames].reverse();

  const buySideColumnNames = isMobileScreen ? columnNames : columnNames;

  return (
    <OrderBookWrapper>
      {!!props.machineState.matches(ORDER_BOOK.LOADING) ? (
        <div>Loading...</div>
      ) : (
        <>
          <OrderBookSide
            isSellSide={true}
            isMobileScreen={isMobileScreen}
            renderBookColumns={renderBookColumns}
            columnNames={sellSideColumnNames}
            renderSellSideLevelRows={renderSellSideLevelRows}
            rowsData={props.sellSideRowsData}
          />
          <OrderBookSide
            isSellSide={false}
            isMobileScreen={isMobileScreen}
            renderBookColumns={renderBookColumns}
            columnNames={buySideColumnNames}
            renderBuySideLevelRows={renderBuySideLevelRows}
            rowsData={props.buySideRowsData}
          />
        </>
      )}
    </OrderBookWrapper>
  );
};

export default OrderBook;

const OrderBookWrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  background: ${colors.backgroundPrimary};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-top: 5px;

  @media (max-width: ${responsiveSizes.mobileScreen}) {
    flex-direction: column-reverse;
  }
`;

const ColumnHeader = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.textLightGray};
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;

  @media (max-width: ${responsiveSizes.mobileScreen}) {
    font-size: 15px;
  }
`;

const LevelRowContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 85%;
  margin: 10px 0;
`;

const LevelRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.textWhite};
  font-size: 18px;
  font-weight: 500;
  font-family: "Fira Code", sans-serif;

  @media (max-width: ${responsiveSizes.mobileScreen}) {
    font-size: 14px;
  }
`;

const LevelRowPriceItem = styled(LevelRowItem)`
  color: ${colors.textGreen};
`;
