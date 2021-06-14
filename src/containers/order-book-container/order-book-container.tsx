import * as React from "react";
import OrderBook from "../../components/order-book/order-book/order-book";
import useWebSocket from "react-use-websocket";
import { bookUi1FeedConsts } from "../../consts";
import { useMachine } from "@xstate/react";
import { orderBookMachine, ORDER_BOOK, ORDER_BOOK_EVENT } from "../../machines";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

export interface OrderBookContainerProps {}

const OrderBookContainer: React.FC<OrderBookContainerProps> = () => {
  const [state, send, service] = useMachine(orderBookMachine);

  // Configure WS connection to Crypto Facilities
  const { REACT_APP_CF_SOCKET_URL } = process.env;
  const socketUrl = `${REACT_APP_CF_SOCKET_URL}`;

  const {
    sendJsonMessage,
    lastJsonMessage,
    // readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("Connection opened");
      send({ type: ORDER_BOOK_EVENT.OPEN_CONNECTION });

      try {
        // // Send the initial message to open the WS connection
        sendJsonMessage({
          event: bookUi1FeedConsts.events.subscribe,
          feed: bookUi1FeedConsts.name,
          product_ids: [bookUi1FeedConsts.productIds.xbtusd],
        });
      } catch (error) {
        send({ type: ORDER_BOOK_EVENT.ERROR });
      }
    },
    onClose: () => {
      console.log("Connection closed");
      send({ type: ORDER_BOOK_EVENT.DISCONNECT });
    },
    onError: () => {
      console.error("Error connecting to CF");
      send({ type: ORDER_BOOK_EVENT.ERROR });
    },
    onMessage: () => {
      if (state.matches(ORDER_BOOK.IDLE)) {
        send({
          type: ORDER_BOOK_EVENT.UPDATE_ORDERS,
          asks: lastJsonMessage.asks,
          bids: lastJsonMessage.bids,
        });
      }
    },
    // Will attempt to reconnect on all close events, such as server shutting down
    // TODO Tighten acceptable reconnect cases
    shouldReconnect: (closeEvent) => false,
  });

  // Hydrate the store
  React.useEffect(() => {
    // If the state isn't idle and there isn't any data in the store, check the last message for a snapshot to be used for hydration
    if (
      (!state.matches(ORDER_BOOK.IDLE) && state?.context?.asks?.length === 0) ||
      state?.context?.bids?.length === 0
    ) {
      if (
        !!lastJsonMessage &&
        lastJsonMessage.feed === bookUi1FeedConsts.snapshot
      ) {
        send({
          type: ORDER_BOOK_EVENT.HYDRATE,
          asks: lastJsonMessage.asks,
          bids: lastJsonMessage.bids,
        });
      }
    }
  }, [
    send,
    lastJsonMessage,
    state.context.asks,
    state.context.bids,
    state.matches,
  ]);

  // React.useEffect(() => {
  //   // const subscription = service.subscribe((state) => {
  //   // TODO Remove this
  //   // Simple state logging
  //   // console.log("XState state: ", state.value);
  //   // });
  // }, [service]);

  return (
    <>
      <Header />
      <OrderBook
        sellSideRowsData={state.context.asks}
        buySideRowsData={state.context.bids}
        machineState={state}
      />
      <Footer
        orderBookMachineSend={send}
        cfSocketSendJsonMessage={sendJsonMessage}
      />
    </>
  );
};

export default OrderBookContainer;
