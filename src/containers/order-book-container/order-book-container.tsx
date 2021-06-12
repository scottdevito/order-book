import * as React from "react";
import OrderBook from "../../components/order-book/order-book/order-book";
import useWebSocket from "react-use-websocket";
import { useOrderBookStore } from "../../contexts/use-order-book-store/use-order-book-store";
import { OrderBookStoreAction } from "../../contexts/use-order-book-store/use-order-book-store-consts";
import { bookUi1FeedConsts } from "../../consts";

export interface OrderBookContainerProps {}

const OrderBookContainer: React.FC<OrderBookContainerProps> = () => {
  const { state, dispatch } = useOrderBookStore();

  // Configure WS connection to Crypto Facilities
  const { REACT_APP_CF_SOCKET_URL } = process.env;
  const socketUrl = `${REACT_APP_CF_SOCKET_URL}`;

  const {
    // sendMessage,
    sendJsonMessage,
    lastMessage,
    // lastJsonMessage,
    readyState,
    // getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connection opened"),
    // Will attempt to reconnect on all close events, such as server shutting down
    // TODO Tighten acceptable reconnect cases
    shouldReconnect: (closeEvent) => true,
  });

  const [messageHistory, setMessageHistory] = React.useState<
    Array<MessageEvent<any>>
  >([]);
  console.log(messageHistory);
  console.log(readyState);

  // Send the initial message to open the WS connection
  React.useEffect(() => {
    sendJsonMessage &&
      sendJsonMessage({
        event: bookUi1FeedConsts.events.subscribe,
        feed: bookUi1FeedConsts.name,
        product_ids: [bookUi1FeedConsts.productIds.xbtusd],
      });

    return sendJsonMessage({
      event: bookUi1FeedConsts.events.unsubscribe,
      feed: bookUi1FeedConsts.name,
      product_ids: [bookUi1FeedConsts.productIds.xbtusd],
    });
  }, [sendJsonMessage]);

  // Hydrate the store
  React.useEffect(() => {
    const lastMessageObj = lastMessage && JSON.parse(lastMessage.data);

    // If there isn't any data in the store, check the last message for a snapshot to be used for hydration
    if (state.asks?.length === 0 || state.bids?.length === 0) {
      if (
        !!lastMessageObj &&
        lastMessageObj.feed === bookUi1FeedConsts.snapshot
      ) {
        dispatch({
          type: OrderBookStoreAction.HydrateOrderBookState,
          payload: { asks: lastMessageObj.asks, bids: lastMessageObj.bids },
        });
      }
    }
  }, [dispatch, lastMessage, state.asks, state.asks]);

  // When last message changes, add it to the list of messages
  React.useEffect(() => {
    lastMessage &&
      setMessageHistory((prevState) => [
        ...prevState,
        JSON.parse(lastMessage.data),
      ]);
  }, [lastMessage]);

  return (
    <OrderBook sellSideRowsData={state.asks} buySideRowsData={state.bids} />
  );
};

export default OrderBookContainer;
