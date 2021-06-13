import React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";
import OrderBookContainer from "../../containers/order-book-container/order-book-container";

function App() {
  return (
    <AppWrapper>
      <OrderBookContainer />
    </AppWrapper>
  );
}

export default App;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: ${colors.backgroundSecondary};
  padding: 7.5px 10px 0 10px;
  box-sizing: border-box;
`;
