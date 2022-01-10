import { Ability } from './TBActor';

declare global {
  interface SourceConfig {
    Actor: AllCharacterDataSource;
  }
}
type AllCharacterDataSource = CharacterDataSource | NpcDataSource;
export interface CommonDataSourceData {
  abilities: {
    will: Ability;
    health: Ability;
    circles: Ability;
    resources: Ability;
    nature: Ability & { current: number; max: number };
    custom1: Ability & { name: string };
    custom2: Ability & { name: string };
    property: string;
    fate: number;
    persona: number;
  };
}
export interface NpcDataSourceData extends CommonDataSourceData, HasDisplayPropsDataSourceData {
  exitMode: boolean;
  bio: string;
}
export interface CharacterDataSource extends CommonDataSourceData, HasDisplayPropsDataSourceData {
  type: 'character';
  data: CharacterDataSourceData;
}
export interface NpcDataSource {
  type: 'npc';
  data: NpcDataSourceData;
}
export interface HasDisplayPropsDataSourceData {
  collapse: {
    beliefs: boolean;
    instincts: boolean;
    goals: boolean;
    traits: boolean;
    abilities: boolean;
    relationships: boolean;
    gear: boolean;
    skills: boolean;
    learning: boolean;
    misc: boolean;
    spells: boolean;
    invocations: boolean;
  };
}
export interface CharacterDataSourceData
  extends CommonDataSourceData,
    HasDisplayPropsDataSourceData {
  stock: string;
  age: number;
  career: string; // TODO real type
  level: number;
  alias: string;
  hometown: string; // TODO item?
  raiment: string;
  miscNotes1: string;
  miscNotes2: string;
  miscNotes3: string;
}
