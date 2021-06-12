import * as React from "react";
import {
  sellSideRowData,
  buySideRowData,
} from "../../components/order-book/mock-row-data";
import OrderBook from "../../components/order-book/order-book/order-book";
import useWebSocket from "react-use-websocket";
import { useOrderBookStore } from "../../contexts/use-order-book-store/use-order-book-store";
import { OrderBookStoreAction } from "../../contexts/use-order-book-store/use-order-book-store-consts";

export interface OrderBookContainerProps {}

const OrderBookContainer: React.FC<OrderBookContainerProps> = () => {
  const { state, dispatch } = useOrderBookStore();

  // Open up WS connection to Crypto Facilities
  const { REACT_APP_CF_SOCKET_URL } = process.env;
  const socketUrl = `${REACT_APP_CF_SOCKET_URL}`;

  const {
    // sendMessage,
    sendJsonMessage,
    lastMessage,
    // lastJsonMessage,
    // readyState,
    // getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connection opened"),
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const [messageHistory, setMessageHistory] = React.useState<
    Array<MessageEvent<any>>
  >([]);
  console.log(messageHistory);

  React.useEffect(() => {
    sendJsonMessage &&
      sendJsonMessage({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      });

    return sendJsonMessage({
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: ["PI_XBTUSD"],
    });
  }, [sendJsonMessage]);

  React.useEffect(() => {
    const lastMessageObj = lastMessage && JSON.parse(lastMessage.data);
    if (!!lastMessageObj && !!lastMessageObj.asks && !!lastMessageObj.bids) {
      dispatch({
        type: OrderBookStoreAction.HydrateOrderBookState,
        payload: { asks: lastMessageObj.asks, bids: lastMessageObj.bids },
      });
    }

    lastMessage &&
      setMessageHistory((prevState) => [
        ...prevState,
        JSON.parse(lastMessage.data),
      ]);
  }, [lastMessage]);

  return <OrderBook sellSideRowData={state.asks} buySideRowData={state.bids} />;
};

export default OrderBookContainer;
