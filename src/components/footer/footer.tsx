import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styles/styles";

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <FooterWrapper>
      <ToggleFeedButton>Toggle Feed</ToggleFeedButton>
      <KillFeedButton>Kill Feed</KillFeedButton>
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
  border-bottom: 2px solid ${colors.backgroundHrLightGray};
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
