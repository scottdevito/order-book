import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";

export interface SellSideProps {}

const SellSide: React.FC<SellSideProps> = () => {
  const renderSellLevelRows = () => {
    return [1, 1, 1, 1, 1, 1, 1, 1].map(() => {
      return (
        <SellLevelRow>
          <SellLevelRowItem>2,300</SellLevelRowItem>
          <SellLevelRowItem>2,300</SellLevelRowItem>
          <SellLevelRowPriceItem>47,341.00</SellLevelRowPriceItem>
        </SellLevelRow>
      );
    });
  };

  return (
    <SellSideWrapper>
      <SellColumnHeadersRowWrapper>
        <SellColumnHeader>Total</SellColumnHeader>
        <SellColumnHeader>Size</SellColumnHeader>
        <SellColumnHeader>Price</SellColumnHeader>
      </SellColumnHeadersRowWrapper>
      <SellLevelsWrapper>{renderSellLevelRows()}</SellLevelsWrapper>
    </SellSideWrapper>
  );
};

export default SellSide;

const SellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  padding: 10px;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
`;

const SellColumnHeadersRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  width: 85%;
`;

const SellColumnHeader = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  color: ${colors.backgroundSecondary};
  font-size: 20px;
  font-weight: 600;
`;

const SellLevelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  width: 85%;
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
