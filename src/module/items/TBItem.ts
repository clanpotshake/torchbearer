import { TBActor } from '../actors/TBActor';
import * as constants from '../constants.js';
import { simpleBroadcast } from '../chat.js';
import { SkillDataRoot } from './TBSkill';
import {
  ItemDataBaseProperties,
  ItemDataSchema
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

// export * from './sheets/armor-sheet.js';
// export * from './sheets/belief-sheet.js';
// export * from './sheets/instinct-sheet.js';
// export * from './sheets/possession-sheet.js';
// export * from './sheets/property-sheet.js';
// export * from './sheets/ranged-sheet.js';
// export * from './sheets/relationship-sheet.js';
// export * from './sheets/reputation-sheet.js';
// export * from './sheets/skill-sheet.js';
// export * from './sheets/trait-sheet.js';
// export * from './sheets/spell-sheet.js';

export class TBItem<T extends TBItemData = TBItemDataTypes> extends Item {
  async generateChatMessage(speaker: TBActor): Promise<ChatMessage | null> {
    return simpleBroadcast({ title: this.name, mainText: `Type - ${this.data.type}` }, speaker);
  }
  prepareData(): void {
    super.prepareData();
    this.data.hasOwner = !!(this.actor && this.actor.data);
  }

  get type(): ItemType {
    return super.type as ItemType;
  }

  async _preCreate(
    data: Partial<TBItemData>,
    options: FoundryDocument.CreateOptions,
    user: User,
  ): Promise<void> {
    await super._preCreate(data as T, options, user);
    if (data.type && this.data._source.img === 'icons/svg/item-bag.svg') {
      this.data._source.img = constants.defaultImages[data.type];
    }
  }
}

export interface ArthaEarner {
  fate: boolean;
  persona: boolean;
  fateSpent: number;
  personaSpent: number;
}
export interface DisplayClass {
  cssClass?: string;
}



export interface TBGearDataSource extends TBItemDataSource {
  pack: number;
  held: number;
  belt: number;
  torso: number;
  head: number;
  hand: number;
  feet: number;
  neck: number;
  arm: number;
}

export interface TBItemDataSource {
  hasOwner: boolean;
}
type AllItemsDataSource = TBItemDataSource|TBGearDataSource;

export interface TBItemData {
  type: ItemType;
  data: TBItemDataSource;
}
declare global {
  interface SourceConfig {
    (Item / Data): AllItemsDataSource;
  }
}


export interface TBGearData {
  type: 'gear';
  data: TBGearDataSource;
}
declare global {
  interface SourceConfig {
    Item: TBItemDataTypes;
  }
}
export type TBItemDataTypes = TBItemData | TBGearData;
export type ItemType =
  | 'belief'
  | 'instinct'
  | 'goal'
  | 'trait'
  | 'skill'
  | 'wise'
  | 'possession'
  | 'property'
  | 'relationship'
  | 'melee weapon'
  | 'ranged weapon'
  | 'spell';

