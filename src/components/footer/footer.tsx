import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import styled from "styled-components";
import { bookUi1FeedConsts, groupingOptions } from "../../consts";
import { useOrderBookMachineSend } from "../../contexts/useOrderBookMachineSend";
import { useOrderBookMachineState } from "../../contexts/useOrderBookMachineState";
import { ORDER_BOOK_EVENT } from "../../machines/order-book-machine-types";
import { colors } from "../../styles/styles";

export interface FooterProps {
  cfSocketSendJsonMessage: SendJsonMessage;
}

const Footer: React.FC<FooterProps> = (props) => {
  const send = useOrderBookMachineSend();
  const state = useOrderBookMachineState();

  // TODO Change to throw an error instead of disconnect
  const handleKillFeed = () => {
    try {
      props.cfSocketSendJsonMessage({
        event: bookUi1FeedConsts.events.unsubscribe,
        feed: bookUi1FeedConsts.name,
        product_ids: [bookUi1FeedConsts.productIds.xbtusd],
      });

      send({ type: ORDER_BOOK_EVENT.DISCONNECT });
    } catch (error) {
      send({ type: ORDER_BOOK_EVENT.ERROR });
    }
  };

  const handleToggleFeed = () => {
    // Unsubscribe from XBT and subscribe to ETH
    if (
      state?.context?.activeProductId === bookUi1FeedConsts.productIds.xbtusd
    ) {
      send({
        type: ORDER_BOOK_EVENT.TOGGLE,
        activeProductId: bookUi1FeedConsts.productIds.ethusd,
        activeGrouping: groupingOptions[bookUi1FeedConsts.productIds.ethusd][0],
      });
    }

    // Unsubscribe from ETH and subscribe to XBT
    send({
      type: ORDER_BOOK_EVENT.TOGGLE,
      activeProductId: bookUi1FeedConsts.productIds.xbtusd,
      activeGrouping: groupingOptions[bookUi1FeedConsts.productIds.xbtusd][0],
    });
  };

  return (
    <FooterWrapper>
      <ToggleFeedButton onClick={handleToggleFeed}>
        Toggle Feed
      </ToggleFeedButton>
      <KillFeedButton onClick={handleKillFeed}>Kill Feed</KillFeedButton>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-height: 80px;
  height: 80px;
  max-height: 80px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const ActionButton = styled.button`
  color: ${colors.textWhite};
  padding: 12.5px 30px;
  margin: 0 5px;
  border-radius: 5px;
  border: none;
  font-weight: 600;

  &:hover {
    cursor: pointer;
  }
`;

const ToggleFeedButton = styled(ActionButton)`
  background: ${colors.buttonBackgroundPurple};
`;

const KillFeedButton = styled(ActionButton)`
  background: ${colors.buttonBackgroundRed};
`;
