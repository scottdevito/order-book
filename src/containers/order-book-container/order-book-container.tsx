import * as React from "react";
import {
  sellSideRowData,
  buySideRowData,
} from "../../components/order-book/mock-row-data";
import OrderBook from "../../components/order-book/order-book/order-book";
import useWebSocket from "react-use-websocket";

export interface OrderBookContainerProps {}

const OrderBookContainer: React.FC<OrderBookContainerProps> = () => {
  // Open up WS connection
  const socketUrl = "wss://www.cryptofacilities.com/ws/v1";

  const {
    // sendMessage,
    sendJsonMessage,
    lastMessage,
    // lastJsonMessage,
    // readyState,
    // getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const [messageHistory, setMessageHistory] = React.useState<Array<any>>([]);

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
  }, []);

  console.log(messageHistory);

  React.useEffect(() => {
    lastMessage &&
      setMessageHistory([...messageHistory, JSON.parse(lastMessage.data)]);
  }, [lastMessage]);

  return (
    <OrderBook
      sellSideRowData={sellSideRowData}
      buySideRowData={buySideRowData}
    />
  );
};

export default OrderBookContainer;
