import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";
import BuySide from "./buy-side";
import SellSide from "./sell-side";

export interface OrderBookProps {}

const OrderBook: React.FC<OrderBookProps> = () => {
  return (
    <OrderBookWrapper>
      <SellSide />
      <BuySide />
    </OrderBookWrapper>
  );
};

export default OrderBook;

const OrderBookWrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
