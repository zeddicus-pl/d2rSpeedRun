import { ChangeEvent, useEffect } from 'react';
import { Container } from './styles'

import { Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { UiState } from '../../App';
import { MouseEventHandler, useState } from 'react';
import { Settings } from '../../@types/main';
import { toast } from 'material-react-toastify';

type MainProps = {
  uiState: UiState,
  settings: Settings,
  localPort: number,
  onFileClick: MouseEventHandler<HTMLButtonElement>,
}

export function Main({ uiState, settings, localPort, onFileClick }: MainProps) {
  const [working, setWorking] = useState(false);
  const [publicLink, setPublicLink] = useState("");

  const getPublicLink = async () => {
    setWorking(true);
    setTimeout(() => {
      setWorking(false);
      window.Main.saveSetting('public', true);
      setPublicLink("testtesttest");
    }, 2000);
  };

  const clearPublicLink = () => {
    if (working === true) {
      return;
    }
    window.Main.saveSetting('public', false);
    setPublicLink("");
  }
  
  const handlePublicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (working === true) {
      return;
    }
    if (e.target.checked) {
      getPublicLink();
    } else {
      clearPublicLink();
    }
  }

  useEffect(() => {
    getPublicLink();
  }, []);

  const PublicLink = () => {
    if (working) {
      return <span>Łączenie z serwerem...</span>
    }
    return <span>Link publiczny{ publicLink ? ":" : ""} <a onClick={() => {
      window.Main.copyToClipboard(publicLink);
      toast.success("Skopiowano link do schowka.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
    }}>{publicLink}</a>
    </span>
  }

  return (
    <Container className="animate__animated animate__fadeIn">
      <h1>Speedrun tool</h1>
      { uiState !== UiState.Loading
        ? <>
          <Button
            variant="contained"
            onClick={onFileClick}
            disableFocusRipple={uiState !== UiState.Ready}
            disableRipple={uiState !== UiState.Ready}
          >
            { uiState === UiState.Ready && "Wybierz folder z sejvami" }
            { uiState === UiState.FileDialog && "Oczekiwanie na wybranie folderu..." }
            { uiState === UiState.Reading && "Odczytywanie plików..." }
            { uiState === UiState.List && "Zmień folder" }
          </Button>
        </>
        : <Typography variant="body2">
          Ładowanie...
        </Typography>
      }
      { uiState === UiState.List && <div style={{ paddingTop: 20 }}>
          <p style={{ marginBottom: 10 }}>
            Śledzony folder:<br />
            <code>{ settings.saveDir }</code>
          </p>
          <p style={{ marginBottom: 10 }}>
            Link lokalny: <a onClick={() => {
              window.Main.copyToClipboard('http://localhost:'+localPort);
              toast.success("Skopiowano link do schowka.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
              });
            }}>http://localhost:{localPort}</a>
          </p>
          <p style={{ marginBottom: 10 }}>
            <FormControlLabel
              disabled={working}
              control={
                <Switch checked={settings.public} onChange={handlePublicChange} name="public" />
              }
              label={<PublicLink />}
            />
          </p>
          <p>
            <div style={{color:"#666"}}><small>Dodaj do OBS jako Browser o wymiarach 700 x 400 pixeli</small></div>
            <iframe style={{ width: 700, height: 400, border: "1px solid #666" }} src="http://localhost:3666" />
          </p>
        </div>
      }
    </Container>
  )
};
