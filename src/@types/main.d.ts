import * as d2s from '@dschu012/d2s';

export type FileReaderResponse = {
  items: d2s.types.IItem[],
  stats: {
    name: string,
    gold: number,
    level: number,
    strength: number,
    energy: number,
    dexterity: number,
    vitality: number,
    unused_skill_points: number,
    max_hp: number,
    fasterRunWalk: number,
    fasterHitRate: number,
    fasterCastRate: number,
    fire: number,
    cold: number,
    lightning: number,
    poison: number,
  },
}

export type Settings = {
  saveDir: string,
  lang: string,
}
