import * as React from "react";
import styled from "styled-components";
import { OrderBookRowData } from "../../../types/order-book-types";

export interface OrderBookSideProps {
  isSellSide: boolean;
  renderBookColumns: (columnNames: Array<string>) => Array<React.ReactElement>;
  columnNames: Array<string>;
  renderLevelRows: (
    rowData: OrderBookRowData,
    isSellSide: boolean
  ) => Array<React.ReactElement>;
  rowData: OrderBookRowData;
}

const OrderBookSide: React.FC<OrderBookSideProps> = (props) => {
  return (
    <SideWrapper isSellSide={props.isSellSide}>
      <ColumnHeadersRowWrapper>
        {props.renderBookColumns(props.columnNames)}
      </ColumnHeadersRowWrapper>
      <LevelsWrapper>
        {props.renderLevelRows(props.rowData, props.isSellSide)}
      </LevelsWrapper>
    </SideWrapper>
  );
};

export default OrderBookSide;

type SideWrapperProps = {
  isSellSide: boolean;
};
const SideWrapper = styled.div<SideWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  padding: ${(props) =>
    props.isSellSide ? "10px 0 10px 10px" : "10px 10px 10px 0"};
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
`;

const ColumnHeadersRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 85%;
`;

const LevelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
`;
