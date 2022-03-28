// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { SkillTest, SlotType, TB } from '../config';
import { ModifiableDataBaseTotal } from '../common/CommonData';
import {
  CharacterDataSource,
  CharacterDataSourceData,
  NpcDataSourceData,
} from './TBActorDataSource';

declare global {
  interface DataConfig {
    Actor: TBActorDataProperties;
  }
}

export type TBActorDataProperties = TBCharacterDataProperties | TBCreatureDataProperties;

interface TBCharacterDataProperties {
  type: 'character';
  data: TBCharacterDataPropertiesData;
}

interface TBCreatureDataProperties {
  type: 'creature';
  data: TBCreatureDataPropertiesData;
}

// templates

interface TBActorDataPropertiesDataBase {
  attributes: TBActorDataPropertiesDataAttributes;
  traits: TBActorDataPropertiesDataTraits;
  tests: TBActorDataPropertiesDataChecks;
}

interface HasMight {
  might: number;
  precedence: number;
}
// the intent here is to have anything that has an inventory (i.e. player character) can define
// how many slots and of what type they contain. or, actor item slots represent _capacity_, and
// item inventory slots represent volume against that capacity.
export interface HasInventorySlots {
  containerSlotCapacities: {
    head: number;
    belt: number;
    feet: number;
    hand: number;
    held: number;
    neck: number;
    pack: number;
    // as pockets are effectively infinite, this represents the capability to have item slots at all
    pocket: boolean;
    torso: number;
    custom: number;
  };
  // should contain any slot type with capacity greater than zero
  containerSlots: SlotType[];
}

type TBActorDataPropertiesDataAttributes = {
  [Key in keyof typeof TB.i18n.attributes]: ModifiableDataBaseTotal<number>;
};

type TBActorDataPropertiesDataTraits = {
  [Key in keyof typeof TB.i18n.traits]: ModifiableDataBaseTotal<number>;
};

type TBActorDataPropertiesDataChecks = {
  [key in SkillTest]: number;
};

export function isTest(value: string): value is SkillTest {
  return Object.keys(TB.i18n.skills).includes(value);
}

// types

interface TBCreatureDataPropertiesData
  extends TBActorDataPropertiesDataBase,
    HasMight,
    HasInventorySlots,
    CharacterDataSource {}

interface TBCharacterDataPropertiesData
  extends TBActorDataPropertiesDataBase,
    HasMight,
    HasInventorySlots,
    CharacterDataSourceData,
    NpcDataSourceData {}
