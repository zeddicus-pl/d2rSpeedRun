import { Container } from './styles'
import { Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { UiState } from '../../App';
import { MouseEventHandler, useState } from 'react';
import { Settings } from '../../@types/main';
import { toast } from 'material-react-toastify';
import { Language } from './language';
import { useTranslation } from 'react-i18next';

type MainProps = {
  uiState: UiState,
  settings: Settings,
  localPort: number,
  onFileClick: MouseEventHandler<HTMLButtonElement>,
}

export function Main({ uiState, settings, localPort, onFileClick }: MainProps) {
  const { t } = useTranslation();
  return (
    <Container className="animate__animated animate__fadeIn">
      <div style={{ position: 'absolute', right: 10, top: 0 }}>
        <Language />
      </div>
      <h1>{t('Speedrun tool')}</h1>
      { uiState !== UiState.Loading
        ? <>
          <Button
            variant="contained"
            onClick={onFileClick}
            disableFocusRipple={uiState !== UiState.Ready}
            disableRipple={uiState !== UiState.Ready}
          >
            { uiState === UiState.Ready && t('Wybierz folder z sejvami') }
            { uiState === UiState.FileDialog && t('Oczekiwanie na wybranie folderu...') }
            { uiState === UiState.Reading && t('Odczytywanie plików...') }
            { uiState === UiState.List && t('Zmień folder') }
          </Button>
        </>
        : <Typography variant="body2">
          {t('Ładowanie...')}
        </Typography>
      }
      { uiState === UiState.List && <div style={{ paddingTop: 20 }}>
          <div style={{ marginBottom: 10 }}>
            {t('Śledzony folder:')}<br />
            <code>{ settings.saveDir }</code>
          </div>
          <div style={{ marginBottom: 10 }}>
            {t('OBS link')}: <a onClick={() => {
              window.Main.copyToClipboard('http://localhost:'+localPort);
              toast.success(t("Skopiowano link do schowka."), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
              });
            }}>http://localhost:{localPort}</a>
          </div>
          <div>
            <iframe style={{ width: '80vw', margin: 'auto', height: 400, border: "1px solid #666" }} src="http://localhost:3666" />
          </div>
        </div>
      }
    </Container>
  )
};
