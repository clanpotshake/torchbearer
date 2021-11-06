// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { TB } from '../config';
import { ModifiableDataBaseTotal } from '../common/CommonData';

declare global {
  interface DataConfig {
    Actor: TBActorDataProperties;
  }
}

export type TBActorDataProperties = TBCharacterDataProperties;
// | TBCreatureDataProperties;

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

export function isTest(value: string): value is SkillTest {
  return Object.keys(TB.i18n.skills).includes(value);
}

// templates

// types

type TBCreatureDataPropertiesData = TBActorDataPropertiesDataBase;

type TBCharacterDataPropertiesData = TBActorDataPropertiesDataBase;
