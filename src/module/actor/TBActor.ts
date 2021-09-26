import { DisplayClass } from '../items/TBItem';

export interface TracksTests {
  passes: number;
  fails: number;
}
export interface Ability extends TracksTests, DisplayClass {
  foo: number;
}

export interface CommonDataSourceData {
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
}
export interface CommonDataPropertiesData extends CommonDataSourceData {
  foo: number;
}
export interface HasDisplayPropsDataSourceData {
  collapseBeliefs: boolean;
  collapseInstincts: boolean;
  collapseGoals: boolean;
  collapseTraits: boolean;
  collapseAbilities: boolean;
  collapseRelationships: boolean;
  collapseGear: boolean;
  collapseSkills: boolean;
  collapseLearning: boolean;
  collapseMisc: boolean;
  collapseSpells: boolean;
  collapseInvocations: boolean;
}

export interface CharacterDataSourceData
  extends CommonDataSourceData,
    HasDisplayPropsDataSourceData {
  stock: string;
  age: number;
  career: string; // TODO real type
  alias: string;
  hometown: string; // TODO item?
  raiment: string;
  miscNotes1: string;
  miscNotes2: string;
  miscNotes3: string;
}

export interface CharacterDataSource {
  type: 'character';
  data: CharacterDataSourceData;
}
export interface NpcDataSourceData extends CommonDataSourceData, HasDisplayPropsDataSourceData {
  exitMode: boolean;
  bio: string;
}
export interface NpcDataSource {
  type: 'npc';
  data: NpcDataSourceData;
}
type AllCharacterDataSource = CharacterDataSource | NpcDataSource;

declare global {
  interface SourceConfig {
    Actor: AllCharacterDataSource;
  }
}
export class TBActor extends Actor {
  prepareData(): void {
    super.prepareData();
  }
}
