import { useMachine } from "@xstate/react";
import * as React from "react";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import styled from "styled-components";
import { Interpreter } from "xstate";
import { bookUi1FeedConsts } from "../../consts";
import {
  ORDER_BOOK_EVENT,
  OrderBookEvent,
  MachineContext,
  OrderBookStateSchema,
} from "../../machines";
import { colors } from "../../styles/styles";

export interface FooterProps {
  orderBookMachineSend: Interpreter<
    MachineContext,
    OrderBookStateSchema,
    OrderBookEvent
  >["send"];
  // orderBookMachineSend: Sender<SingleOrArray<SCXML.Event<OrderBookEvent>>>;
  cfSocketSendJsonMessage: SendJsonMessage;
}

const Footer: React.FC<FooterProps> = (props) => {
  // TODO Change to throw an error instead of disconnect
  const handleKillFeed = () => {
    try {
      props.cfSocketSendJsonMessage({
        event: bookUi1FeedConsts.events.unsubscribe,
        feed: bookUi1FeedConsts.name,
        product_ids: [bookUi1FeedConsts.productIds.xbtusd],
      });
      props.orderBookMachineSend({ type: ORDER_BOOK_EVENT.DISCONNECT });
    } catch (error) {
      props.orderBookMachineSend({ type: ORDER_BOOK_EVENT.ERROR });
    }
  };

  return (
    <FooterWrapper>
      <ToggleFeedButton>Toggle Feed</ToggleFeedButton>
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
