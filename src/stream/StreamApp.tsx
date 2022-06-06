import { useState, useEffect, ReactNode } from 'react';
import { useTimer } from "react-use-precision-timer";
import { io } from "socket.io-client";
import { FileReaderResponse, Settings } from '../@types/main.d';
import { Grid, createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { GlobalStyle } from '../styles/GlobalStyle';
import prettyMs from 'pretty-ms';

export default function StreamApp() {
  const [data, setData] = useState<FileReaderResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const timer = useTimer({
    delay: 1000,
    callback: () => { setLastUpdate(lastUpdate + 1);}
  });

  useEffect(() => {
    const socket = io();
    socket.on("updatedSettings", function (settings: Settings) {
      //
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
        <div id="stats">
          <Grid container>
            <Grid item xs={4}>
              <Grid container>
                <Grid item xs={4} sx={{ textAlign: 'left', color: '#ffbd6a' }}>
                  Gold:
                </Grid>
                <Grid item xs={8} sx={{ color: '#ffbd6a' }}>
                  {gold}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left', color: '#ff8888' }}>
                  Fire:
                </Grid>
                <Grid item xs={8} sx={{ color: '#ff8888' }}>
                  {data.stats.fire}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left', color: '#8888ff' }}>
                  Cold:
                </Grid>
                <Grid item xs={8} sx={{ color: '#8888ff' }}>
                  {data.stats.cold}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left', color: '#ffff88' }}>
                  Ligh:
                </Grid>
                <Grid item xs={8} sx={{ color: '#ffff88' }}>
                  {data.stats.lightning}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left', color: '#88ff88' }}>
                  Pois:
                </Grid>
                <Grid item xs={8} sx={{ color: '#88ff88' }}>
                  {data.stats.poison}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid container>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Lvl:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.level}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Str:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.strength}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Dex:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.dexterity}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Vit:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.vitality}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Ene:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.energy}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3} alignItems={'end'}>
              <Grid container>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Fhr:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.fasterHitRate}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Fcr:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.fasterCastRate}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'left' }}>
                  Frw:
                </Grid>
                <Grid item xs={8}>
                  {data.stats.fasterRunWalk}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ paddingLeft: 15, paddingTop: 3 }}>
            {runesArr}
          </div>
          <div style={{ paddingLeft: 15, paddingTop: 5, color: '#777', fontSize: 14 }}>
            {lastUpdate > 5 && <>Odczytane {lastUpdateFmt} temu</>}
          </div>
        </div>
        <div id="timer">
          <div id="game">
            <div className="label">Czas gry</div>
            <div className="time">00:00:00</div>
          </div>
          <div id="real">
            <div className="label">Czas łączny</div>
            <div className="time">00:00:00</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  </>;
}