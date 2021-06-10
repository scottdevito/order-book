import React from "react";
import styled from "styled-components";
import Footer from "./components/footer/footer";

import Header from "./components/header/header";
import OrderBook from "./components/order-book/order-book";

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
`;
