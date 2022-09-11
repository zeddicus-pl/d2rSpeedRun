import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100vh;
  }

  body {
    font-family: monospace !important;
    font-size: 16px !important;
    color: #E1E1E6;
  }

  a {
    color: #6E55AE;
    text-decoration: none;
  }

  span, p, a {
    font-family: monospace !important;
  }

  body#streamRoot {
      margin: 0;
      padding: 0;
  }

  div#stream {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      margin: 0;
      border: 0;
      justify-content: space-between;
  }
`
