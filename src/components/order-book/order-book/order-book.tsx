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
import { ORDER_BOOK } from "../../../machines";

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

/**
 * Util function to render OrderBook level rows
 * @param rowsData Array of [size, price] that represents all of the data for either the Buy or Sell side
 * @returns An array of rows as React elements
 */
export const renderLevelRows = (
  rowsData: OrderBookRowsData,
  isSellSide: boolean,
  isMobileScreen: boolean
) => {
  // Pre-calculate the final Total so we can use it in each row to create the depth visualizer
  const finalTotal =
    rowsData.length > 0
      ? rowsData.reduce((total: Total, currentItem: OrderData) => {
          return (total = total + currentItem[1]);
        }, 0)
      : 0;

  let runningTotal = 0;

  // Create row - calculate row Total and store vars for depth visualizer
  return rowsData.map((rowItem, idx) => {
    // Get the new row Total based on the previous Total and the new Size
    const currentRowItemTotal = runningTotal + rowItem[1];

    // Calculate the depth percentage based off of this row's Total
    const currentRowItemDepthPercent = (currentRowItemTotal / finalTotal) * 100;

    // Update the running total
    runningTotal = currentRowItemTotal;

    // Reorder rows considering which side we're rendering and on what the size of the screen is
    return isSellSide && !isMobileScreen ? (
      <LevelRowVisWrapper
        key={idx}
        depthVisualizationValue={currentRowItemDepthPercent}
        isSellSide={isSellSide}
      >
        <LevelRowContentWrapper>
          <LevelRowItem>{currentRowItemTotal}</LevelRowItem>
          <LevelRowItem>{rowItem[1]}</LevelRowItem>
          <LevelRowPriceItem>{rowItem[0]}</LevelRowPriceItem>
        </LevelRowContentWrapper>
      </LevelRowVisWrapper>
    ) : (
      <LevelRowVisWrapper
        key={idx}
        depthVisualizationValue={currentRowItemDepthPercent}
        isSellSide={isSellSide}
      >
        <LevelRowContentWrapper>
          <LevelRowPriceItem>{rowItem[0]}</LevelRowPriceItem>
          <LevelRowItem>{rowItem[1]}</LevelRowItem>
          <LevelRowItem>{currentRowItemTotal}</LevelRowItem>
        </LevelRowContentWrapper>
      </LevelRowVisWrapper>
    );
  });
};

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
      {props.machineState.matches(ORDER_BOOK.LOADING) ? (
        <div>LOADING...</div>
      ) : (
        <>
          <OrderBookSide
            isSellSide={true}
            isMobileScreen={isMobileScreen}
            renderBookColumns={renderBookColumns}
            columnNames={sellSideColumnNames}
            renderLevelRows={renderLevelRows}
            rowsData={props.sellSideRowsData}
          />
          <OrderBookSide
            isSellSide={false}
            isMobileScreen={isMobileScreen}
            renderBookColumns={renderBookColumns}
            columnNames={buySideColumnNames}
            renderLevelRows={renderLevelRows}
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

type LevelRowVisWrapperProps = {
  depthVisualizationValue: number;
  isSellSide: boolean;
};
const LevelRowVisWrapper = styled.div<LevelRowVisWrapperProps>`
  width: 100%;
  background: ${(props) =>
    props.isSellSide
      ? `url(${sellDepthVisualizerBg})`
      : `url(${buyDepthVisualizerBg})`};
  background-repeat: no-repeat;
  background-position: ${(props) => (props.isSellSide ? "right" : "left")};
  background-size: ${(props) => `${props.depthVisualizationValue}% 100%`};

  @media (max-width: ${responsiveSizes.mobileScreen}) {
    background-position: right;
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
