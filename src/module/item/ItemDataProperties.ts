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

interface BeliefDataPropertiesData extends BeliefDataSourceData {
  text: string;
}

interface InstinctDataPropertiesData extends InstinctDataSourceData {
  text: string;
}
interface GoalDataPropertiesData extends GoalDataSourceData {
  text: string;
}
interface CreedDataPropertiesData extends CreedDataSourceData {
  text: string;
}
type TraitDataPropertiesData = TraitDataSourceData;
type SkillDataPropertiesData = SkillDataSourceData;
type RelationshipDataPropertiesData = RelationshipDataSourceData;
type GearDataPropertiesData = GearDataSourceData;
type PropertyDataPropertiesData = PropertyDataSourceData;
type SpellDataPropertiesData = SpellDataSourceData;
type ClassDataPropertiesData = ClassDataSourceData;
