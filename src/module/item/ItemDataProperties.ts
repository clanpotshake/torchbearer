import {
  BeliefDataSourceData,
  ClassDataSourceData,
  CreedDataSourceData,
  GearDataSourceData,
  GoalDataSourceData,
  InstinctDataSourceData,
  PropertyDataSourceData,
  RelationshipDataSourceData,
  SkillDataSourceData,
  SpellDataSourceData,
  TraitDataSourceData,
} from './ItemDataSource';

declare global {
  interface DataConfig {
    Item: AllItemsDataProperties;
  }
}

type AllItemsDataProperties =
  | BeliefDataProperties
  | InstinctDataProperties
  | GoalDataProperties
  | CreedDataProperties
  | TraitDataProperties
  | SkillDataProperties
  | GearDataProperties
  | PropertyDataProperties
  | RelationshipDataProperties
  | ClassDataProperties
  | SpellDataProperties;

interface BeliefDataProperties {
  type: 'belief';
  data: BeliefDataPropertiesData;
}
interface InstinctDataProperties {
  type: 'instinct';
  data: InstinctDataPropertiesData;
}
interface GoalDataProperties {
  type: 'goal';
  data: GoalDataPropertiesData;
}
interface CreedDataProperties {
  type: 'creed';
  data: CreedDataPropertiesData;
}
interface TraitDataProperties {
  type: 'trait';
  data: TraitDataPropertiesData;
}
interface SkillDataProperties {
  type: 'skill';
  data: SkillDataPropertiesData;
}
interface GearDataProperties {
  type: 'gear';
  data: GearDataPropertiesData;
}
interface PropertyDataProperties {
  type: 'property';
  data: PropertyDataPropertiesData;
}
interface RelationshipDataProperties {
  type: 'relationship';
  data: RelationshipDataPropertiesData;
}
interface ClassDataProperties {
  type: 'class';
  data: ClassDataPropertiesData;
}
interface SpellDataProperties {
  type: 'spell';
  data: SpellDataPropertiesData;
}

// templates

interface ItemDataPropertiesDataRollable {
  rollable: boolean;
}

interface ItemDataPropertiesDataGrantsMagic {
  hasMemoryPalace: boolean;
}

interface ItemDataPropertiesDataGrantsInvocation {
  hasUrdr: boolean;
}
interface ItemDataPropertiesDataLearningSkill {
  learning: boolean;
}
interface ItemDataPropertiesDataIsContainer {
  isContainer: boolean;
}
export interface TracksTests {
  passes: number;
  fails: number;
}

// types

interface BeliefDataPropertiesData
  extends BeliefDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {
  text: string;
}

interface InstinctDataPropertiesData
  extends InstinctDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {
  text: string;
}
interface GoalDataPropertiesData
  extends GoalDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {
  text: string;
}
interface CreedDataPropertiesData
  extends CreedDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {
  text: string;
}
interface TraitDataPropertiesData
  extends TraitDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {}
interface SkillDataPropertiesData
  extends SkillDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataLearningSkill,
    ItemDataPropertiesDataGrantsInvocation {}
interface RelationshipDataPropertiesData
  extends RelationshipDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {}
interface GearDataPropertiesData
  extends GearDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataIsContainer,
    ItemDataPropertiesDataGrantsInvocation {}
interface PropertyDataPropertiesData
  extends PropertyDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {}
interface SpellDataPropertiesData
  extends SpellDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {}
interface ClassDataPropertiesData
  extends ClassDataSourceData,
    ItemDataPropertiesDataRollable,
    ItemDataPropertiesDataGrantsMagic,
    ItemDataPropertiesDataGrantsInvocation {}
