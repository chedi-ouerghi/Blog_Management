import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.footerBackground};
  color: ${({ theme }) => theme.footerText};
  padding: 20px 0;
  text-align: center;
  font-size: 1rem;
  position: relative;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  margin: 0;
  font-weight: bold;
  color: ${({ theme }) => theme.footerText};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.footerLink};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.footerLinkHover};
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; 2025 <FooterLink href="/">Blog Platform</FooterLink>. All rights reserved.
      </FooterText>
    </FooterWrapper>
  );
};

export default Footer;
