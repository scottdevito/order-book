import * as React from "react";
import styled from "styled-components";
import { colors } from "../../../styles/styles";
import { OrderBookRowData } from "../../../types/order-book-types";
import OrderBookSide from "../order-book-side/order-book-side";

export interface OrderBookProps {
  sellSideRowData: OrderBookRowData;
  buySideRowData: OrderBookRowData;
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
 * @param rowData Array of [size, price] that represents all of the data for either the Buy or Sell side
 * @returns An array of rows as React elements
 */
export const renderLevelRows = (
  rowData: OrderBookRowData,
  isSellSide: boolean
) => {
  let runningTotal = 0;

  // Create row - order columns based on which side we're rendering
  return rowData.map((rowItem, idx) => {
    const rowToRender = isSellSide ? (
      <LevelRow key={idx}>
        <LevelRowItem>{runningTotal + rowItem[0]}</LevelRowItem>
        <LevelRowItem>{rowItem[0]}</LevelRowItem>
        <LevelRowPriceItem>{rowItem[1]}</LevelRowPriceItem>
      </LevelRow>
    ) : (
      <LevelRow key={idx}>
        <LevelRowPriceItem>{rowItem[1]}</LevelRowPriceItem>
        <LevelRowItem>{rowItem[0]}</LevelRowItem>
        <LevelRowItem>{runningTotal + rowItem[0]}</LevelRowItem>
      </LevelRow>
    );

    // Update the running total
    runningTotal = runningTotal + rowItem[0];

    return rowToRender;
  });
};

const OrderBook: React.FC<OrderBookProps> = (props) => {
  const sellSideColumnNames = ["Total", "Size", "Price"];
  const buySideColumnNames = [...sellSideColumnNames].reverse();

  return (
    <OrderBookWrapper>
      <OrderBookSide
        isSellSide={true}
        renderBookColumns={renderBookColumns}
        columnNames={sellSideColumnNames}
        renderLevelRows={renderLevelRows}
        rowData={props.sellSideRowData}
      />
      <OrderBookSide
        isSellSide={false}
        renderBookColumns={renderBookColumns}
        columnNames={buySideColumnNames}
        renderLevelRows={renderLevelRows}
        rowData={props.buySideRowData}
      />
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
`;

const LevelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 100%;
  margin: 10px 0;
`;

const LevelRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.textWhite};
  font-size: 20px;
  font-weight: 600;
`;

const LevelRowPriceItem = styled(LevelRowItem)`
  color: ${colors.textGreen};
`;
