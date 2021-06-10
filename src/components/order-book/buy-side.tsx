import * as React from "react";
import styled from "styled-components";

export interface BuySideProps {}

const BuySide: React.FC<BuySideProps> = () => {
  return <BuySideWrapper>Buy</BuySideWrapper>;
};

export default BuySide;

const BuySideWrapper = styled.div`
  flex: 1;
  padding: 10px;
  height: 100%;
  width: 100%;
`;

// TODO Create reusable components from SellSide
