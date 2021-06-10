import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";

export interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <HeaderWrapper>
      <Title>Order Book</Title>
      <GroupingSelect>
        <option>Group 0.50</option>
      </GroupingSelect>
    </HeaderWrapper>
  );
};

export default Header;

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
`;

const Title = styled.h3`
  color: ${colors.textWhite};
`;

const GroupingSelect = styled.select`
  background: ${colors.selectBackgroundGray};
  color: ${colors.textWhite};
  border: none;
  padding: 0 10px;
  width: 120px;
  height: 30px;
  border-radius: 5px;
`;
