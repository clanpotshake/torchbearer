// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { TB } from '../config';

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
  combatValues: TBActorDataPropertiesDataCombatValues;
  rolling: TBActorDataPropertiesDataRolling;
  checks: TBActorDataPropertiesDataChecks;
}

type TBActorDataPropertiesDataAttributes = {
  [Key in keyof typeof TB.i18n.attributes]: ModifiableDataBaseTotal<number>;
};

type TBActorDataPropertiesDataTraits = {
  [Key in keyof typeof TB.i18n.traits]: ModifiableDataBaseTotal<number>;
};

type TBActorDataPropertiesDataCombatValues = {
  [Key in keyof typeof TB.i18n.combatValues]: Key extends 'hitPoints'
    ? ResourceDataBaseTotalMax<number>
    : ModifiableDataBaseTotal<number>;
};

interface TBActorDataPropertiesDataRolling {
  maximumCoupResult: number;
  minimumFumbleResult: number;
}

type TBActorDataPropertiesDataChecks = {
  [key in Check]: number;
};

export type Check = keyof typeof TB.i18n.checks;

export function isCheck(value: string): value is Check {
  return Object.keys(TB.i18n.checks).includes(value);
}

// types

interface TBCreatureDataPropertiesData extends TBActorDataPropertiesDataBase {
  baseInfo: TBCreatureDataSourceDataBaseInfo;
}

interface TBCharacterDataPropertiesData extends TBActorDataPropertiesDataBase {
  baseInfo: TBCharacterDataSourceDataBaseInfo;
  progression: TBCharacterDataSourceDataProgression;
  profile: TBCharacterDataSourceDataProfile;
}
