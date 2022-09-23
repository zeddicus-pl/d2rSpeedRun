import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: sans-serif !important;
  color: #E1E1E6;
  font-size: 14px;

  h1 {
    padding: 0;
    margin-top: 4px;
    margin-bottom: 0;
  }

  button {
    margin-top: 14px;
  }

  ul {
    margin: 2px;
  }

  a {
    color: #6e6ec4;
    img {
      height: 12px;
      padding-left: 4px;
    }
  }

  h6 {
    width: 300px;
    text-align: right;
    font-size: 16px;
    margin-top: 5px;
  }
`

export const Image = styled.img`
  width: 300px;
`

export const Text = styled.p`
  margin-top: 24px;
  font-size: 18px;
`

export const FolderButton = styled.div`
  .MuiButtonBase {
    margin-top: 0 !important;
  }
`