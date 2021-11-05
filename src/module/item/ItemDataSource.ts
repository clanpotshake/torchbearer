import { TB } from '../config';
import { TracksTests } from '../actor/TBActor';

declare global {
  interface SourceConfig {
    Item: TBItemDataSource;
  }
}

export type ItemType = keyof typeof TB.i18n.itemTypes;
export type ClassType = keyof typeof TB.i18n.classes;
export type AttributeType = keyof typeof TB.i18n.attributes;

type TBItemDataSource =
  | BeliefDataSource
  | InstinctDataSource
  | GoalDataSource
  | CreedDataSource
  | TraitDataSource
  | SkillDataSource
  | RelationshipDataSource
  | GearDataSource
  | PropertyDataSource
  | SpellDataSource
  | ClassDataSource;

export interface BeliefDataSource {
  type: 'belief';
  data: BeliefDataSourceData;
}
export interface InstinctDataSource {
  type: 'instinct';
  data: InstinctDataSourceData;
}
export interface GoalDataSource {
  type: 'goal';
  data: GoalDataSourceData;
}
export interface CreedDataSource {
  type: 'creed';
  data: CreedDataSourceData;
}
export interface TraitDataSource {
  type: 'trait';
  data: TraitDataSourceData;
}
export interface SkillDataSource {
  type: 'skill';
  data: SkillDataSourceData;
}
export interface RelationshipDataSource {
  type: 'relationship';
  data: RelationshipDataSourceData;
}
export interface GearDataSource {
  type: 'gear';
  data: GearDataSourceData;
}
export interface PropertyDataSource {
  type: 'property';
  data: PropertyDataSourceData;
}
export interface SpellDataSource {
  type: 'spell';
  data: SpellDataSourceData;
}
export interface ClassDataSource {
  type: 'class';
  data: ClassDataSourceData;
}
// templates

// types

export interface BeliefDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: true;
}
export interface InstinctDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: false;
}
export interface GoalDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: true;
}
export interface CreedDataSourceData extends ArthaEarnerDataSource {
  fate: false;
  persona: true;
}
interface ArthaEarnerDataSource {
  fate: boolean;
  persona: boolean;
}
export interface TraitDataSourceData {
  description: string;
  collapsed: boolean;
  level: number;
  checks: number;
}
export interface SkillDataSourceData extends TracksTests {
  collapsed: boolean;
  rank: number;
  attempts: number;
  tools: boolean;
}
export interface RelationshipDataSourceData {
  description: string;
  location: string;
  skill: string;
  isFriend: boolean;
  isEnemy: boolean;
  isParent: boolean;
}
export interface GearDataSourceData {
  description: string;
  pack: number;
  held: number;
  belt: number;
  torso: number;
  head: number;
  hand: number;
  feet: number;
  neck: number;
  arm: number;
  pocket: boolean;
}
export interface PropertyDataSourceData {
  description: string;
  isWorkshop: boolean;
  location: string;
}
export interface SpellDataSourceData {
  description: string;
  circle: number;
  scribeOb: number;
  learnOb: number;
  castOb: number;
  material: string;
  castTime: string;
  casting: string;
  duration: string;
  factors: string;
}
interface LevelBenefit {
  optionA: string;
  optionB: string;
}
export interface ClassDataSourceData {
  classType: ClassType;
  level1: string;
  level2: LevelBenefit;
  level3: LevelBenefit;
  level4: LevelBenefit;
  level5: LevelBenefit;
  level6: LevelBenefit;
  level7: LevelBenefit;
  level8: LevelBenefit;
  level9: LevelBenefit;
  level10: LevelBenefit;
}
