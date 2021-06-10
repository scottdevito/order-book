import * as React from "react";
import styled from "styled-components";
import { styles } from "../../styles/styles";

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

const HeaderWrapper = styled.header<HeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  height: 70px;
  max-height: 70px;
  border-bottom: 2px solid ${styles.backgroundHrLightGray};
  padding: 0 75px 0 15px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  background: ${styles.backgroundPrimary};
`;

const Title = styled.h3`
  color: ${styles.textWhite};
`;

const GroupingSelect = styled.select`
  background: ${styles.selectBackgroundGray};
  color: ${styles.textWhite};
  border: none;
  padding: 0 10px;
  width: 120px;
  height: 30px;
  border-radius: 5px;
`;
