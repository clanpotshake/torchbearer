import { CharacterSheetData, CharacterSheetOptions } from '../Options';
import { ActorSheet } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/applications/formApplications/documentSheets/actorSheet';

export class TBCharacterSheet extends ActorSheet<CharacterSheetOptions, CharacterSheetData> {
  /** @override */
  static get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {});
  }
}
export class TBCharacterSheetData extends ActorSheet.Data<> {}
