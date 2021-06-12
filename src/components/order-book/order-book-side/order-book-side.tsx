import * as React from "react";
import styled from "styled-components";
import { responsiveSizes } from "../../../consts";
import { OrderBookRowsData } from "../../../types/order-book-types";

export interface OrderBookSideProps {
  isSellSide: boolean;
  isMobileScreen: boolean;
  renderBookColumns: (columnNames: Array<string>) => Array<React.ReactElement>;
  columnNames: Array<string>;
  renderLevelRows: (
    rowData: OrderBookRowsData,
    isSellSide: boolean,
    isMobileScreen: boolean
  ) => Array<React.ReactElement>;
  rowsData: OrderBookRowsData;
}

const OrderBookSide: React.FC<OrderBookSideProps> = (props) => {
  return (
    <SideWrapper isSellSide={props.isSellSide}>
      <ColumnHeadersRowWrapper isSellSide={props.isSellSide}>
        {props.renderBookColumns(props.columnNames)}
      </ColumnHeadersRowWrapper>
      <LevelsWrapper isSellSide={props.isSellSide}>
        {props.renderLevelRows(
          props.rowsData,
          props.isSellSide,
          props.isMobileScreen
        )}
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

  /* Strip left and right padding on mobile */
  @media (max-width: ${responsiveSizes.mobileScreen}) {
    padding: 10px 0;
  }
`;

type ColumnHeadersRowWrapperProps = {
  isSellSide: boolean;
};
const ColumnHeadersRowWrapper = styled.div<ColumnHeadersRowWrapperProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 85%;

  /* Don't display Sell column header row on mobile */
  @media (max-width: ${responsiveSizes.mobileScreen}) {
    display: ${(props) => (!!props.isSellSide ? "none" : "grid")};
  }
`;

type LevelsWrapperProps = {
  isSellSide: boolean;
};
const LevelsWrapper = styled.div<LevelsWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  width: 100%;

  /* Reverse Buy levels order on mobile */
  @media (max-width: ${responsiveSizes.mobileScreen}) {
    flex-direction: ${(props) =>
      props.isSellSide === false ? "column-reverse" : "column"};
  }
`;
