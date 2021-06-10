import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";
import { OrderBookRowData } from "../../types/order-book-types";
import OrderBookSide from "./order-book-side";

export interface OrderBookProps {}

const OrderBook: React.FC<OrderBookProps> = () => {
  const sellSideColumnNames = ["Total", "Size", "Price"];
  const buySideColumnNames = [...sellSideColumnNames].reverse();

  // Mock row data
  const sellSideRowData = [
    [2300, 47341.0],
    [2100, 32141.0],
  ];

  const buySideRowData = [
    [1100, 27341.0],
    [3100, 12141.0],
  ];

  /**
   * Util function to render OrderBook columns
   * @param columnNames
   * @returns An array of column header labels as elements
   */
  const renderBookColumns = (columnNames: Array<string>) => {
    return columnNames.map((columnName) => {
      return <ColumnHeader>{columnName}</ColumnHeader>;
    });
  };

  /**
   * Util function to render OrderBook level rows
   * @param rowData Array of [size, price] that represents all of the data for either the Buy or Sell side
   * @returns An array of rows as React elements
   */
  const renderLevelRows = (rowData: OrderBookRowData, isSellSide: boolean) => {
    // TODO Figure out total here
    return rowData.map((rowItem, idx) => {
      return isSellSide ? (
        <SellLevelRow key={idx}>
          <SellLevelRowItem>2,300</SellLevelRowItem>
          <SellLevelRowItem>{rowItem[0]}</SellLevelRowItem>
          <SellLevelRowPriceItem>{rowItem[1]}</SellLevelRowPriceItem>
        </SellLevelRow>
      ) : (
        <SellLevelRow key={idx}>
          <SellLevelRowPriceItem>{rowItem[1]}</SellLevelRowPriceItem>
          <SellLevelRowItem>{rowItem[0]}</SellLevelRowItem>
          <SellLevelRowItem>2,300</SellLevelRowItem>
        </SellLevelRow>
      );
    });
  };

  return (
    <OrderBookWrapper>
      <OrderBookSide
        isSellSide={true}
        renderBookColumns={renderBookColumns}
        columnNames={sellSideColumnNames}
        renderLevelRows={renderLevelRows}
        rowData={sellSideRowData}
      />
      <OrderBookSide
        isSellSide={false}
        renderBookColumns={renderBookColumns}
        columnNames={buySideColumnNames}
        renderLevelRows={renderLevelRows}
        rowData={buySideRowData}
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

const SellLevelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 100%;
`;

const SellLevelRowItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.textWhite};
  font-size: 20px;
  font-weight: 600;
`;

const SellLevelRowPriceItem = styled(SellLevelRowItem)`
  color: ${colors.textGreen};
`;
