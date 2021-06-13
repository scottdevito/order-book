import * as React from "react";
import OrderBook from "../../components/order-book/order-book/order-book";
import useWebSocket from "react-use-websocket";
import { useOrderBookStore } from "../../contexts/use-order-book-store/use-order-book-store";
import { OrderBookStoreAction } from "../../contexts/use-order-book-store/use-order-book-store-consts";
import { bookUi1FeedConsts } from "../../consts";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { orderBookMachine, ORDER_BOOK_EVENT } from "../../machines";

export interface OrderBookContainerProps {}

const OrderBookContainer: React.FC<OrderBookContainerProps> = () => {
  // const { state, dispatch } = useOrderBookStore();
  const [state, send, service] = useMachine(orderBookMachine);

  // Configure WS connection to Crypto Facilities
  const { REACT_APP_CF_SOCKET_URL } = process.env;
  const socketUrl = `${REACT_APP_CF_SOCKET_URL}`;

  const {
    sendJsonMessage,
    lastMessage,
    // lastJsonMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("Connection opened");
      send({ type: ORDER_BOOK_EVENT.OPEN_CONNECTION });

      // // Send the initial message to open the WS connection
      sendJsonMessage({
        event: bookUi1FeedConsts.events.subscribe,
        feed: bookUi1FeedConsts.name,
        product_ids: [bookUi1FeedConsts.productIds.xbtusd],
      });
    },
    onClose: () => {
      console.log("Connection closed");
      send({ type: ORDER_BOOK_EVENT.DISCONNECT });
    },
    onError: () => {
      console.error("Error connecting to CF");
      send({ type: ORDER_BOOK_EVENT.ERROR });
    },
    // Will attempt to reconnect on all close events, such as server shutting down
    // TODO Tighten acceptable reconnect cases
    shouldReconnect: (closeEvent) => true,
  });

  // Hydrate the store
  React.useEffect(() => {
    const lastMessageObj = lastMessage && JSON.parse(lastMessage.data);

    // If there isn't any data in the store, check the last message for a snapshot to be used for hydration
    if (
      state?.context?.asks?.length === 0 ||
      state?.context?.bids?.length === 0
    ) {
      if (
        !!lastMessageObj &&
        lastMessageObj.feed === bookUi1FeedConsts.snapshot
      ) {
        send({
          type: ORDER_BOOK_EVENT.HYDRATE,
          asks: lastMessageObj.asks,
          bids: lastMessageObj.bids,
        });
      }
    }
  }, [send, lastMessage, state.context.asks, state.context.bids]);

  // Unsubscribe
  //   return sendJsonMessage({
  //     event: bookUi1FeedConsts.events.unsubscribe,
  //     feed: bookUi1FeedConsts.name,
  //     product_ids: [bookUi1FeedConsts.productIds.xbtusd],
  //   });

  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      // TODO Remove this
      // Simple state logging
      console.log("XState state: ", state);
    });
  }, [service]);

  return (
    <OrderBook
      sellSideRowsData={state.context.asks}
      buySideRowsData={state.context.bids}
      machineState={state}
    />
  );
};

export default OrderBookContainer;
