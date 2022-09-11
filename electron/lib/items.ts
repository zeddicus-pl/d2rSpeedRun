import { dialog } from 'electron';
import * as d2s from '@dschu012/d2s';
import { constants } from '@dschu012/d2s/lib/data/versions/96_constant_data';
import { existsSync, promises } from 'fs';
import { basename, extname, join, resolve, sep } from 'path';
import { IpcMainEvent } from 'electron/renderer';
import { readdirSync, statSync } from 'original-fs';
import { FileReaderResponse } from '../../src/@types/main.d';
import chokidar, { FSWatcher } from 'chokidar';
import { eventToReply, setEventToReply } from '../main';
import settingsStore from './settings';
import { updateDataToListeners } from './stream';
const { readFile } = promises;

class ItemsStore {
  currentData: FileReaderResponse | null;
  fileWatcher: FSWatcher | null;
  watchPath: string | null;
  filesChanged: boolean;
  readingFiles: boolean;

  constructor() {
    this.currentData = {
      items: [],
      stats: {
        level: 0,
        name: "",
        gold: 0,
        strength: 0,
        energy: 0,
        dexterity: 0,
        vitality: 0,
        unused_skill_points: 0,
        max_hp: 0,
        fasterRunWalk: 0,
        fasterHitRate: 0,
        fasterCastRate: 0,
        fire: 0,
        cold: 0,
        lightning: 0,
        poison: 0,
      }
    };
    this.fileWatcher = null;
    this.watchPath = null;
    this.filesChanged = false;
    this.readingFiles = false;
    setInterval(this.tickReader, 500);
  }

  getItems = () => {
    return this.currentData;
  }

  openAndParseSaves = (event: IpcMainEvent) => {
    return dialog.showOpenDialog({
      title: "Select Diablo 2 / Diablo 2 Resurrected save folder",
      message: "Select Diablo 2 / Diablo 2 Resurrected save folder",
      properties: ['openDirectory'],
    }).then((result) => {
      if (result.filePaths[0]) {
        const path = result.filePaths[0];
        event.reply('openFolderWorking', null);
        this.parseSaves(event, path, true);
      } else {
        this.currentData = null;
        event.reply('openFolder', null);
        updateDataToListeners();
      }
    }).catch((e) => {
      console.log(e);
    });
  };

  prepareChokidarGlobe = (filename: string): string => {
    if (filename.length < 2) {
      return filename;
    }
    const resolved = resolve(filename);
    return resolved.substring(0, 1) + resolved.substring(1).split(sep).join('/') + '/*.d2s';
  }

  parseSaves = async (event: IpcMainEvent, path: string, userRequested: boolean) => {
    const files = readdirSync(path).filter(file => ['.d2s'].indexOf(extname(file).toLowerCase()) !== -1);

    if (!eventToReply) {
      setEventToReply(event);
    }

    if (files.length) {
      // if no file watcher is active
      if (!this.fileWatcher) {
        this.watchPath = path;
        this.fileWatcher = chokidar.watch(this.prepareChokidarGlobe(this.watchPath), {
          followSymlinks: false,
          ignoreInitial: true,
          depth: 0,
        }).on('all', () => {
          this.filesChanged = true;
        });
      }
      // if file watcher is enabled, and directory changed
      if (this.fileWatcher && this.watchPath && this.watchPath !== path) {
        this.fileWatcher.unwatch(this.prepareChokidarGlobe(this.watchPath)).add(this.prepareChokidarGlobe(path));
        this.watchPath = path;
      }
    }

    const getNewestFile = (files: string[]): string | null => {
        const out: Array<{ file: string, mtime: number }> = [];
        files.forEach((file: string) => {
            const stats = statSync(join(path, file));
            if(stats.isFile()) {
                out.push({"file": file, "mtime": stats.mtime.getTime()});
            }
        });
        out.sort(function(a,b) {
            return b.mtime - a.mtime;
        })
        return (out.length > 0) ? out[0].file : null;
    }

    const newest = getNewestFile(files);

    if (newest) {
      const saveName = basename(newest).replace(".d2s", "");
      let result: FileReaderResponse | null = null;
      await readFile(join(path, newest))
        .then((buffer) => this.parseSave(saveName, buffer, extname(newest).toLowerCase()))
        .then((data) => {
          result = data;
        })
        .catch((e) => {
          console.log("ERROR", e);
          event.reply('error', (e as Error).message);
          return null;
        })
      if (result) {
        if (userRequested && path && path !== '') {
          settingsStore.saveSetting('saveDir', path);
        }
        event.reply('openFolder', result);
        this.currentData = result;
        updateDataToListeners();
      }
    }

  }

  parseSave = async (saveName: string, content: Buffer, extension: string): Promise<FileReaderResponse> => {
    const items: d2s.types.IItem[] = [];
    const stats = {
      name: '',
      gold: 0,
      level: 0,
      strength: 0,
      energy: 0,
      dexterity: 0,
      vitality: 0,
      unused_skill_points: 0,
      max_hp: 0,
      fasterRunWalk: 0,
      fasterHitRate: 0,
      fasterCastRate: 0,
      fire: 0,
      cold: 0,
      lightning: 0,
      poison: 0,
    };
    
    const parseItems = (itemList: d2s.types.IItem[]) => {
      itemList.forEach((item) => {
        items.push(item);
        if (item.socketed_items && item.socketed_items.length) {
          parseItems(item.socketed_items);
        }
      });
    }

    const parseD2S = (response: d2s.types.ID2S) => {
      const items = response.items || [];
      const mercItems = response.merc_items || [];
      const corpseItems = response.corpse_items || [];
      const itemList = [
        ...items,
        ...mercItems,
        ...corpseItems,
      ]
      parseItems(itemList);
      stats.name = response.header.name;
      stats.gold = (response.attributes.gold || 0) + (response.attributes.stashed_gold || 0);
      stats.level = response.header.level;
      stats.strength = response.attributes.strength;
      stats.energy = response.attributes.energy;
      stats.dexterity = response.attributes.dexterity;
      stats.vitality = response.attributes.vitality;
      stats.unused_skill_points = response.attributes.unused_skill_points;
      stats.max_hp = response.attributes.max_hp;


      response.item_bonuses.forEach(bonus => {
        if (bonus.name === 'item_fastercastrate') {
          stats.fasterCastRate = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'item_fastergethitrate') {
          stats.fasterHitRate = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'item_fastermovevelocity') {
          stats.fasterRunWalk = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'fireresist') {
          stats.fire = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'coldresist') {
          stats.cold = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'lightresist') {
          stats.lightning = bonus.values.reduce((acc, val) => acc + val);
        }
        if (bonus.name === 'poisonresist') {
          stats.poison = bonus.values.reduce((acc, val) => acc + val);
        }
      });
    };

    await d2s.read(content, constants).then(parseD2S);
    return {
      items,
      stats,
    };
  };

  readFilesUponStart = async (event: IpcMainEvent) => {
    const saveDir = settingsStore.getSetting('saveDir');
    if (saveDir && existsSync(saveDir)) {
      this.parseSaves(event, saveDir, false);
    } else {
      event.reply('noDirectorySelected', null);
    }
  }

  tickReader = async () => {
    if (eventToReply && this.watchPath && this.filesChanged && !this.readingFiles) {
      console.log('re-reading files!');
      this.readingFiles = true;
      this.filesChanged = false;
      await this.parseSaves(eventToReply, this.watchPath, false);
      this.readingFiles = false;
    }
  }

  shutdown = async () => {
    if (this.fileWatcher) {
      await this.fileWatcher.close();
    }
  }
}

const itemsStore = new ItemsStore();
export default itemsStore;