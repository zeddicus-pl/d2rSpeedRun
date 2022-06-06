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

  #stats .MuiGrid-item {
    padding: 2px;
    font-variant: small-caps;
    text-align: left;
  }

  #stats .MuiGrid-container .MuiGrid-container .MuiGrid-item:nth-child(odd) {
    text-align: right !important;
  }

  body#streamRoot {
      margin: 0;
      padding: 0;
      width: 700px;
      height: 400px;
      overflow: hidden;
  }

  div#stream {
      display: flex;
      flex-direction: row;
      width: 700px;
      box-sizing: border-box;
      margin: 0;
      border: 0;
  }

  div#stats {
      width: 500px;
  }

  div#timer {
      width: 200px;
  }

  #timer {
      text-align: center;
  }

  #real {
      padding-top: 10px;
  }
  .time {
      font-size: 38px;
      font-weight: bold;
  }

`
