import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: background-color 0.3s, color 0.3s;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.link};
    &:hover {
      color: ${({ theme }) => theme.linkHover};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

export default GlobalStyles;
