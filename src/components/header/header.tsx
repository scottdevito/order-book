import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";
import useDropdownMenu from "react-accessible-dropdown-menu-hook";
import { bookUi1FeedConsts, groupingOptions } from "../../consts";
import { useOrderBookMachineSend } from "../../contexts/useOrderBookMachineSend";
import { useOrderBookMachineState } from "../../contexts/useOrderBookMachineState";
import {
  AvailableGroupings,
  ORDER_BOOK_EVENT,
} from "../../machines/order-book-machine-types";

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const send = useOrderBookMachineSend();
  const state = useOrderBookMachineState();

  const { buttonProps, itemProps, isOpen, setIsOpen } = useDropdownMenu(3);

  const [activeGrouping, setActiveGrouping] = React.useState<number>(0);

  // Keeps track of which set of grouping options should be used at any given time
  const renderDynamicGroupingOptions = () => {
    if (
      state?.context?.activeProductId === bookUi1FeedConsts.productIds.xbtusd
    ) {
      return groupingOptions[bookUi1FeedConsts.productIds.xbtusd] as [
        AvailableGroupings["XBTUSD"]
      ];
    }
    return groupingOptions[bookUi1FeedConsts.productIds.ethusd] as [
      AvailableGroupings["ETHUSD"]
    ];
  };

  const handleChangeGroupingClick = (event: React.MouseEvent, idx: number) => {
    event.preventDefault();

    setActiveGrouping(idx);
    setIsOpen(false);

    send({
      type: ORDER_BOOK_EVENT.GROUP,
      activeGrouping: renderDynamicGroupingOptions()[idx],
    });
  };

  const renderGroupingMenuListItems = (
    activeGroupingOptions:
      | [AvailableGroupings["XBTUSD"]]
      | [AvailableGroupings["ETHUSD"]]
  ) => {
    return activeGroupingOptions.map((listItem, idx) => {
      return (
        <GroupingMenuListItem
          key={`${listItem}-${idx}`}
          {...itemProps[idx]}
          onClick={(event: React.MouseEvent) =>
            handleChangeGroupingClick(event, idx)
          }
          href={"#"}
        >
          {listItem}
        </GroupingMenuListItem>
      );
    });
  };

  React.useEffect(() => {
    setActiveGrouping(0);
  }, [state?.context?.activeProductId]);

  return (
    <HeaderWrapper>
      <Title>Order Book</Title>
      <GroupingSelectWrapper>
        <GroupingSelect {...buttonProps}>
          {`Group ${renderDynamicGroupingOptions()[activeGrouping]}`}
        </GroupingSelect>
        <GroupingMenu className={isOpen ? "visible" : ""} role="menu">
          {renderGroupingMenuListItems(renderDynamicGroupingOptions())}
        </GroupingMenu>
      </GroupingSelectWrapper>
    </HeaderWrapper>
  );
};

export default React.memo(Header);

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  height: 60px;
  max-height: 60px;
  padding: 0 75px 0 15px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  background: ${colors.backgroundPrimary};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  div[role="menu"] {
    visibility: hidden;
  }

  div[role="menu"].visible {
    transition: transform 0.2s, opacity 0.2s, visibility linear;
    visibility: visible;
    opacity: 1;
  }
`;

const Title = styled.h3`
  color: ${colors.textWhite};
`;

const GroupingSelectWrapper = styled.div`
  position: relative;
`;

const GroupingSelect = styled.button`
  font-family: "Montserrat", sans-serif;
  background: ${colors.selectBackgroundGray};
  color: ${colors.textWhite};
  border: none;
  padding: 0 10px;
  font-size: 14px;
  width: 140px;
  text-align: left;
  height: 30px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }
`;

const GroupingMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  transform: translate(0, -10px);

  background: ${colors.selectBackgroundGray};
  padding: 0.8rem 1rem;
  border: 2px solid ${colors.backgroundPrimary};
  border-radius: 0.25rem;
  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);
  opacity: 0;
  visibility: hidden;
  transition: transform 0.2s, opacity 0.2s, visibility 0s linear 0.2s;
  will-change: transform;
  position: absolute;
  width: fit-content;
  left: 0;
  right: 0;
  margin: 0.8rem auto auto;
  z-index: 2;
`;

const GroupingMenuListItem = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${colors.textWhite};
  height: 25px;
  width: 100%;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    background: ${colors.backgroundSecondary};
  }
`;
