import { GlobalStyle } from './styles/GlobalStyle'

import { Main } from './components/Main'

import { useState, useEffect, MouseEventHandler } from 'react';
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material';
import { ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import { FileReaderResponse, Settings } from './@types/main.d';
import defaultSettings from './utils/defaultSettings';

/* eslint-disable no-unused-vars */
export enum UiState {
  Loading = -1,
  Ready = 0,
  FileDialog = 1,
  Reading = 2,
  List = 3,
}
/* eslint-enable no-unused-vars */

export function App() {
  const [uiState, setUiState] = useState(UiState.Loading);
  const [appSettings, setAppSettings] = useState<Settings>(defaultSettings);
  const [localPort, setLocalPort] = useState(0);

  const updateSettings = (settings: Settings) => {
    // @ts-ignore
    if (!settings.saveDir) {
      settings.saveDir = '';
    }
    if (!settings.public) {
      settings.public = false;
    }
    setAppSettings(settings);
  }

  const readData = (settings: Settings) => {
    if (settings.saveDir && settings.saveDir !== '') {
      window.Main.readFilesUponStart();
    } else {
      setUiState(UiState.Ready);
    }
  }

  const handleFileClick = async () => {
    if (uiState === UiState.Ready || uiState === UiState.List) {
      setUiState(UiState.FileDialog);
      window.Main.openFolder();
    }
  }

  useEffect(() => {
    window.Main.on('updatedSettings', (settings: Settings) => {
      updateSettings(settings);
      readData(settings);
    });
    window.Main.on('noDirectorySelected', () => {
      setUiState(UiState.Ready);
    });
    window.Main.on('openFolderWorking', () => {
      setUiState(UiState.Reading);
    });
    window.Main.on('openFolder', (fileReaderResponse: FileReaderResponse) => {
      if (fileReaderResponse === null) {
        if (uiState !== UiState.Loading) {
          setUiState(UiState.Ready);
        }
        return;
      }
      if (uiState !== UiState.Reading) {
        setUiState(UiState.List);
        return;
      }
      setTimeout(() => {
        setUiState(UiState.List);
      }, 500);
    });

    const settings = window.Main.getSettings();
    updateSettings(settings);
    readData(settings);

    const auxclickHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
      event.preventDefault();
    }

    setLocalPort(window.Main.getStreamPort());

    // @ts-ignore
    document.addEventListener('auxclick', auxclickHandler, false);
  }, [])

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={createTheme({palette: { mode: 'dark' }})}>
        <>
          <Main
            uiState={uiState}
            onFileClick={handleFileClick}
            localPort={localPort}
            settings={appSettings}
          />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
          />
        </>
      </ThemeProvider>
    </>
  )
}