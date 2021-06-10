import React from "react";
import styled from "styled-components";
import Footer from "./components/footer/footer";

import Header from "./components/header/header";
import OrderBook from "./components/order-book/order-book";
import { colors } from "./styles/styles";

function App() {
  return (
    <AppWrapper>
      <Header />
      <OrderBook />
      <Footer />
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
