interface ArthaEarnerDataSource {
  fate: boolean;
  persona: boolean;
}
export interface DisplayClass {
  cssClass?: string;
}

export interface BeliefDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: true;
}
interface BeliefDataPropertiesData extends BeliefDataSourceData {
  text: string;
}

export interface InstinctDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: false;
}
interface InstinctDataPropertiesData extends BeliefDataSourceData {
  text: string;
}
export interface GoalDataSourceData extends ArthaEarnerDataSource {
  fate: true;
  persona: true;
}
interface GoalDataPropertiesData extends BeliefDataSourceData {
  text: string;
}
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

type AllItemsDataSource = BeliefDataSource | InstinctDataSource | GoalDataSource;
type AllItemsDataProperties = BeliefDataProperties | InstinctDataProperties | GoalDataProperties;

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
export class BIGItem extends Item {
  prepareData(): void {
    super.prepareData();
  }
}

declare global {
  interface SourceConfig {
    Item: AllItemsDataSource;
  }
  interface DataConfig {
    Item: AllItemsDataProperties;
  }
  interface ItemDocumentClassConfig {
    Item: typeof BIGItem;
  }
}
