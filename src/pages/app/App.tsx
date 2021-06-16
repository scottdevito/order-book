import React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";
import Header from "../../components/header/header";
import OrderBookContainerXbt from "../../containers/order-book-container/order-book-container-xbt";
import OrderBookContainerEth from "../../containers/order-book-container/order-book-container-eth";
import { useMachine } from "@xstate/react";
import { orderBookMachine } from "../../machines/order-book-machine";
import { OrderBookMachineSendContext } from "../../contexts/useOrderBookMachineSend";
import { OrderBookMachineStateContext } from "../../contexts/useOrderBookMachineState";
import { bookUi1FeedConsts } from "../../consts";

function App() {
  const [state, send] = useMachine(orderBookMachine);

  return (
    <AppWrapper>
      <OrderBookMachineSendContext.Provider value={send}>
        <OrderBookMachineStateContext.Provider value={state}>
          <>
            <Header />
            {state.context.activeProductId ===
            bookUi1FeedConsts.productIds.ethusd ? (
              <OrderBookContainerEth />
            ) : (
              <OrderBookContainerXbt />
            )}
          </>
        </OrderBookMachineStateContext.Provider>
      </OrderBookMachineSendContext.Provider>
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
