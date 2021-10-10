import { TBActorSheet } from './TBActorSheet';

export class TBCharacterActorSheetData extends TBActorSheet {
  /** @override */
  static get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['tb2', 'sheet', 'actor', 'character'],
    });
  }
}
