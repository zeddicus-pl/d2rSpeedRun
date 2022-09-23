import { Container, FolderButton } from './styles'
import { Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { UiState } from '../../App';
import { MouseEventHandler, useState } from 'react';
import { Settings } from '../../@types/main';
import { toast } from 'material-react-toastify';
import { Language } from './language';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
      <FolderButton>
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
      </FolderButton>
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
            }}>http://localhost:{localPort} <ContentCopyIcon fontSize='small' /></a>
          </div>
          <p>
            {t("Statistics are updated each time the game saves the game, which is:")}
            <ul>
              <li>{t("(about) each 5 minutes")}</li>
              <li>{t("each time an item is identified")}</li>
              <li>{t("when you quit&save the game")}</li>
            </ul>
            {t("Note: statistics from charms are counted in, regardless of their level requirement, to simplify the algorithm")}
          </p>
          <div>
            <iframe style={{ width: '80vw', margin: 'auto', height: 200, border: "1px solid #333" }} src="http://localhost:3666" />
          </div>
        </div>
      }
    </Container>
  )
};
