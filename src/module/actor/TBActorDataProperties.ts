// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { TB } from '../config';
import { ModifiableDataBaseTotal } from '../common/CommonData';
import { CharacterDataSource, NpcDataSourceData } from './TBActorDataSource';

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
  containerSlots: {
    pack: number;
    held: number;
    belt: number;
    torso: number;
    head: number;
    hand: number;
    feet: number;
    neck: number;
    arm: number;
    // as pockets are effectively infinite, this represents the capability to have item slots at all
    pocket: boolean;
  };
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

export type SkillTest = keyof typeof TB.i18n.skills;
export type SlotType = keyof typeof TB.i18n.slots;

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
    NpcDataSourceData {}
