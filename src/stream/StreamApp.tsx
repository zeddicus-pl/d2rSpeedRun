import { useState, useEffect, ReactNode } from 'react';
import { useTimer } from "react-use-precision-timer";
import { io } from "socket.io-client";
import { FileReaderResponse, Settings } from '../@types/main.d';
import { Grid, createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { GlobalStyle } from '../styles/GlobalStyle';
import prettyMs from 'pretty-ms';
import { StatLabel, StatLine, StatValue } from './styles';
import { useTranslation } from 'react-i18next';

export default function StreamApp() {
  const [data, setData] = useState<FileReaderResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const timer = useTimer({
    delay: 1000,
    callback: () => { setLastUpdate(lastUpdate + 1);}
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const socket = io();
    socket.on("updatedSettings", function (settings: Settings) {
      i18n.changeLanguage(settings.lang);
    });
    socket.on("openFolder", function (data: FileReaderResponse) {
      setData(data);
      setLastUpdate(0);
    });
    timer.start();
  }, []);

  if (data === null) {
    return null;
  }

  const runes: {[runeId: number]: {count: number, name: string}} = {};
  data.items.forEach(item => {
    if (item.categories.includes("Rune")) {
      const idx = parseInt(item.type.replace('r', ''));
      if (!runes[idx]) {
        runes[idx] = {
          count: 1,
          name: item.type_name.replace(' Rune', ''),
        }
      } else {
        runes[idx].count++;
      }
    }
  })

  const runesArr: ReactNode[] = [];
  
  Object.keys(runes)
    .forEach((idxStr: string, i: number) => {
      const idx = parseInt(idxStr);
      if (!runes[idx]) return null;
      if (i > 0) {
        runesArr.push(<span key={i + 'sep'}> </span>);
      }
      if (runes[idx].count === 1) {
        runesArr.push(<span key={idx}>{runes[idx].name}</span>);
      }
      if (runes[idx].count > 1) {
        runesArr.push(<span key={idx}><small>{ runes[idx].count }</small>{runes[idx].name}</span>);
      }
    });

  const gold = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(data.stats.gold)
  const lastUpdateFmt = prettyMs(lastUpdate * 1000, {compact: true});

  return <>
    <GlobalStyle />
    <ThemeProvider theme={createTheme({palette: { mode: 'dark' }})}>
      <div id="stream">
        <div id="stats" style={{ width: '100%' }}>
          <Grid container>
            <Grid item xs={4}>
              <StatLine>
                <StatLabel style={{  color: '#ffbd6a' }}>
                  Gold:
                </StatLabel>
                <StatValue style={{ color: '#ffbd6a' }}>
                  {gold}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel style={{ color: '#ff8888' }}>
                  Fire:
                </StatLabel>
                <StatValue style={{ color: '#ff8888' }}>
                  {data.stats.fire}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel style={{ color: '#8888ff' }}>
                  Cold:
                </StatLabel>
                <StatValue style={{ color: '#8888ff' }}>
                  {data.stats.cold}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel style={{ color: '#ffff88' }}>
                  Ligh:
                </StatLabel>
                <StatValue style={{ color: '#ffff88' }}>
                  {data.stats.lightning}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel style={{ color: '#88ff88' }}>
                  Pois:
                </StatLabel>
                <StatValue style={{ color: '#88ff88' }}>
                  {data.stats.poison}
                </StatValue>
              </StatLine>
            </Grid>
            <Grid item xs={4}>
              <StatLine>
                <StatLabel>
                  Lvl:
                </StatLabel>
                <StatValue>
                  {data.stats.level}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  Str:
                </StatLabel>
                <StatValue>
                  {data.stats.strength}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  Dex:
                </StatLabel>
                <StatValue>
                  {data.stats.dexterity}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  Vit:
                </StatLabel>
                <StatValue>
                  {data.stats.vitality}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  Ene:
                </StatLabel>
                <StatValue>
                  {data.stats.energy}
                </StatValue>
              </StatLine>
            </Grid>
            <Grid item xs={4} alignItems={'end'}>
              <StatLine>
                <StatLabel>
                  FHR:
                </StatLabel>
                <StatValue>
                  {data.stats.fasterHitRate}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  FCR:
                </StatLabel>
                <StatValue>
                  {data.stats.fasterCastRate}
                </StatValue>
              </StatLine>
              <StatLine>
                <StatLabel>
                  FRW:
                </StatLabel>
                <StatValue>
                  {data.stats.fasterRunWalk}
                </StatValue>
              </StatLine>
            </Grid>
          </Grid>
          <div style={{ paddingLeft: 15, paddingTop: 3 }}>
            {runesArr}
          </div>
          <div style={{ paddingLeft: 15, paddingTop: 5, color: '#777', fontSize: 14 }}>
            {lastUpdate > 5 && <>{t('Odczytane ')}{lastUpdateFmt} {t('temu')}</>}
          </div>
        </div>
      </div>
    </ThemeProvider>
  </>;
}